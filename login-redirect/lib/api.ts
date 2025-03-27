// API服务 - 与后端通信

// API基础URL
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080';

// Dify应用类型 - 与后端保持一致
export type AppType = 'Chat' | 'Workflow' | null;

// Dify应用接口 - 根据后端实际返回的数据结构调整
export interface DifyApp {
  id: number;
  name: string;
  description: string;
  apiKey: string;
  inputType: string;
  outputType: string;
  createTime: string | null;
  updateTime: string;
  chatModel: string;
  formConfig: string;
  type: AppType;
  icon?: string; // 前端补充字段，实际后端不返回
}

// Dify应用前端显示对象
export interface AppDisplay {
  id: string;
  name: string;
  icon: string;
  description: string;
  usageCount: number;
  tags: string[];
  category: string;
}

// 聊天消息请求接口
export interface ChatMessageRequest {
  query: string;
  inputs?: Record<string, any>;
  user?: string;
  conversationId?: string;
  files?: string[];
  autoGenerateName?: boolean;
}

// 聊天消息响应接口
export interface ChatMessageResponse {
  answer: string;
  task_id: string;
  conversation_id: string;
  message_id: string;
  metadata?: any;
  [key: string]: any;
}

// 将DifyApp转换为AppDisplay
export const convertToAppDisplay = (app: DifyApp): AppDisplay => {
  // 根据应用类型设置标签
  const appTypeTag = app.type === 'Chat' ? '对话式' : '工作流';
  
  return {
    id: app.id.toString(),
    name: app.name,
    icon: '/placeholder.svg?height=48&width=48', // 使用默认图标
    description: app.description,
    usageCount: Math.floor(Math.random() * 500) + 50, // 模拟使用次数
    tags: [appTypeTag, '快速使用'],
    category: '科研'
  };
};

// 获取所有Dify应用
export const getAllDifyApps = async (): Promise<AppDisplay[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/dify-apps`);
    if (!response.ok) {
      console.error(`获取应用列表失败，状态码: ${response.status}`);
      return [];
    }
    const apps: DifyApp[] = await response.json();
    // 转换所有应用
    return apps.map(convertToAppDisplay);
  } catch (error) {
    console.error('获取应用列表错误:', error);
    return [];
  }
};

// 获取科研类应用 - 实际上返回所有应用
export const getScienceApps = async (): Promise<AppDisplay[]> => {
  return getAllDifyApps();
};

// 获取单个应用详情
export const getDifyAppById = async (id: string): Promise<AppDisplay | null> => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/dify-apps/${id}`);
    if (!response.ok) {
      console.error(`获取应用详情失败，状态码: ${response.status}`);
      return null;
    }
    const app: DifyApp = await response.json();
    return convertToAppDisplay(app);
  } catch (error) {
    console.error('获取应用详情错误:', error);
    return null;
  }
};

// 发送聊天消息 - 使用流式API而非阻塞式
export const sendChatMessage = async (
  appId: string | number,
  request: ChatMessageRequest
): Promise<ChatMessageResponse> => {
  try {
    console.log('发送聊天消息请求:', {appId, request});
    
    // 确保请求参数格式正确
    const cleanedRequest = {
      query: request.query,
      inputs: request.inputs || {},
      user: request.user || 'anonymous',
      conversationId: request.conversationId, // 可以为undefined
      files: request.files || [],
      autoGenerateName: request.autoGenerateName || false
    };
    
    // 使用流式API
    const response = await fetch(`${API_BASE_URL}/api/dify/chat-messages?appId=${appId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'text/event-stream'
      },
      body: JSON.stringify(cleanedRequest),
    });

    // 记录响应状态
    console.log(`聊天消息响应状态: ${response.status}`);
    
    if (!response.ok) {
      let errorText = '';
      try {
        errorText = await response.text();
        console.error('服务器返回错误:', errorText);
      } catch (e) {
        console.error('无法读取错误响应内容');
      }
      throw new Error(`发送聊天消息失败，状态码: ${response.status}, 错误: ${errorText}`);
    }

    // 处理SSE流响应，转换为普通响应对象
    const reader = response.body?.getReader();
    if (!reader) {
      throw new Error('无法读取响应流');
    }

    // 收集所有chunks
    let receivedText = '';
    let result: ChatMessageResponse = {
      answer: '',
      task_id: 'generated',
      conversation_id: 'generated',
      message_id: 'generated'
    };

    // 收集所有答案片段
    let answerParts: string[] = [];
    let buffer = ''; // 用于处理跨块的数据
    
    console.log('开始处理SSE流...');
    
    let done = false;
    while (!done) {
      const { value, done: readerDone } = await reader.read();
      done = readerDone;
      
      if (value) {
        // 解码接收到的数据
        const chunk = new TextDecoder().decode(value);
        // 记录前100个字符用于调试
        console.log(`收到数据块(前100字符): ${chunk.substring(0, 100)}`);
        receivedText += chunk;
        
        // 处理可能不完整的SSE数据 (可能跨越多个chunk)
        buffer += chunk;
        
        // 尝试几种可能的事件分隔符
        const possibleSeparators = ['\n\n', '\r\n\r\n', '\r\r'];
        let events: string[] = [];
        
        // 找到可能适用的分隔符
        for (const separator of possibleSeparators) {
          if (buffer.includes(separator)) {
            events = buffer.split(separator);
            // 保留最后一个可能不完整的事件
            buffer = events.pop() || '';
            break;
          }
        }
        
        // 如果没有发现任何分隔符，但buffer过大，尝试使用\n作为分隔符
        if (events.length === 0 && buffer.length > 1000) {
          events = buffer.split('\n');
          buffer = events.pop() || '';
        }
        
        for (const event of events) {
          // 处理事件 - 尝试多种格式
          const trimmedEvent = event.trim();
          
          // 检查是否为SSE数据行
          if (trimmedEvent.startsWith('data:')) {
            try {
              // 提取data部分
              const dataContent = trimmedEvent.substring(5).trim();
              console.log(`解析数据: ${dataContent.substring(0, 50)}...`);
              
              // 检查是否是JSON
              if (dataContent && dataContent.length > 0) {
                if (dataContent.startsWith('{') && dataContent.endsWith('}')) {
                  try {
                    // 尝试解析JSON
                    const jsonData = JSON.parse(dataContent);
                    
                    // 处理不同类型的事件
                    if (jsonData.event === 'message') {
                      console.log('收到message事件');
                      const message = jsonData.data || {};
                      
                      // 处理增量式文本回答
                      if (message.answer !== undefined) {
                        answerParts.push(message.answer);
                        console.log(`添加回答片段: ${message.answer.substring(0, 30)}...`);
                      }
                      
                      // 收集元数据
                      if (message.conversation_id) {
                        result.conversation_id = message.conversation_id;
                        console.log(`设置会话ID: ${message.conversation_id}`);
                      }
                      if (message.id) {
                        result.message_id = message.id;
                      }
                      if (message.task_id) {
                        result.task_id = message.task_id;
                      }
                    } else if (jsonData.event === 'agent_message') {
                      // 处理agent_message事件 - 包含增量式回答片段
                      console.log('收到agent_message事件');
                      const message = jsonData.data || {};
                      if (message.text) {
                        answerParts.push(message.text);
                        console.log(`添加回答片段(agent): ${message.text.substring(0, 30)}...`);
                      }
                    } else if (jsonData.event === 'error') {
                      console.error('收到错误事件:', jsonData.data);
                      throw new Error(`流式API错误: ${JSON.stringify(jsonData.data)}`);
                    } else if (jsonData.event === 'done') {
                      console.log('收到完成事件');
                      // 不需要特殊处理，while循环会自然结束
                    } else {
                      console.log(`未处理的事件类型: ${jsonData.event}`);
                    }
                  } catch (e) {
                    console.error('无法解析JSON数据:', e);
                  }
                } else if (dataContent === '[DONE]') {
                  console.log('收到[DONE]信号');
                  // 这是OpenAI风格的完成信号，不需要处理
                } else {
                  // 不是标准JSON或[DONE]，可能是纯文本回复
                  answerParts.push(dataContent);
                  console.log(`添加非JSON回答片段: ${dataContent.substring(0, 30)}...`);
                }
              }
            } catch (e) {
              console.error('SSE数据处理错误:', e);
            }
          } else if (trimmedEvent.startsWith('event:')) {
            console.log(`检测到事件类型指示器: ${trimmedEvent}`);
            // 事件类型处理，不需要特殊操作，因为我们已经在data部分处理
          }
        }
      }
    }
    
    console.log('SSE流处理完成');
    
    // 合并所有答案片段
    result.answer = answerParts.join('');
    
    // 如果没有收到任何答案，但接收到了一些数据
    if (result.answer.length === 0 && receivedText.length > 0) {
      console.log('未能解析出回答，尝试使用原始响应');
      result.answer = receivedText;
    }
    
    console.log(`最终回答长度: ${result.answer.length}字符`);
    
    return result;
  } catch (error) {
    console.error('发送聊天消息错误:', error);
    throw error;
  }
};

// 检查API可用性与支持的模式
export const checkApiAvailability = async (appId: string | number): Promise<{
  available: boolean;
  supportsStream: boolean;
  supportsBlock: boolean;
  error?: string;
}> => {
  try {
    // 简单的心跳检查
    const response = await fetch(`${API_BASE_URL}/health`);
    const available = response.ok;
    
    if (!available) {
      return {
        available: false,
        supportsStream: false,
        supportsBlock: false,
        error: `API服务不可用，状态码: ${response.status}`
      };
    }
    
    // 检查流式支持
    const supportsStream = await checkStreamSupport(appId);
    
    // 检查阻塞式支持
    const supportsBlock = await checkBlockSupport(appId);
    
    return {
      available,
      supportsStream,
      supportsBlock,
      error: undefined
    };
  } catch (error) {
    console.error('API可用性检查错误:', error);
    return {
      available: false,
      supportsStream: false,
      supportsBlock: false,
      error: `API检查失败: ${(error as Error).message}`
    };
  }
};

// 检查是否支持流式API (这里简化实现，实际可能需要真实探测)
const checkStreamSupport = async (appId: string | number): Promise<boolean> => {
  // 这里假设支持流式API
  return true;
};

// 检查是否支持阻塞式API
const checkBlockSupport = async (appId: string | number): Promise<boolean> => {
  // 这里假设支持阻塞式API
  return true;
};

// 生成大纲API (示例功能)
export const generateOutline = async (
  appId: string | number,
  title: string,
  keywords: string,
  field: string,
  outlineType: string,
  language: string
): Promise<string[]> => {
  try {
    const prompt = `
    请为一篇${field}领域的${outlineType}生成一个大纲。
    标题: ${title}
    关键词: ${keywords}
    要求:
    1. 使用${language}语言
    2. 大纲应包含标题、引言、主要章节(3-5个)、结论
    3. 每个章节应有2-3个子节
    4. 保持学术严谨性
    请直接给出大纲，无需额外解释。
    `;
    
    const response = await sendChatMessage(appId, {
      query: prompt,
      user: 'outline_generator'
    });
    
    // 解析回答为大纲数组
    const outlineText = response.answer.trim();
    // 简单按行分割，可能需要更复杂的解析逻辑
    const outlineArray = outlineText.split('\n')
      .filter(line => line.trim().length > 0);
    
    return outlineArray;
  } catch (error) {
    console.error('生成大纲错误:', error);
    throw error;
  }
};
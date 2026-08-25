export type ToolCall = {
    id: string;
    function: { name: string; arguments: string }; 
};

export type Mensagem = {
    role: "system" | "user" | "assistant" | "tool";
    content: string | Array<{ type: "text" | "image_url"; text?: string; image_url?: { url: string } }>;
    tool_calls?: ToolCall[];
    tool_call_id?: string;
};
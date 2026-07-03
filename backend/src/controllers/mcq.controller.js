import { generateMCQsService } from '../services/mcq.service.js';
import { generateNotesService } from '../services/notes.service.js';
import { generateQAService } from '../services/qa.service.js';
import { generateChatService } from '../services/chat.service.js';
import { RecentChat } from '../models/recentChat.model.js';

export const generateChat = async (req, res) => {
    try {
        const { topic } = req.body;
        
        if (!topic) {
            return res.status(400).json({ success: false, error: "Prompt is required" });
        }

        const chatMarkdown = await generateChatService(topic);
        
        let newChatId = null;
        if (req.user) {
            const newChat = await RecentChat.create({
                user: req.user._id,
                title: `Chat: ${topic.substring(0, 30)}${topic.length > 30 ? '...' : ''}`,
                messages: [
                    { role: 'user', content: topic },
                    { role: 'assistant', content: chatMarkdown }
                ]
            });
            newChatId = newChat._id;
        }
        
        res.json({ 
            success: true, 
            topic,
            data: chatMarkdown,
            chatId: newChatId
        });
    } catch (error) {
        console.error("Error generating Chat:", error);
        res.status(500).json({ success: false, error: "Failed to generate Chat", details: error.message });
    }
};

export const generateMCQs = async (req, res) => {
    try {
        const { topic, numQuestions, difficulty = "Medium" } = req.body;
        
        if (!topic) {
            return res.status(400).json({ success: false, error: "Topic is required" });
        }

        const mcqs = await generateMCQsService(topic, numQuestions, difficulty);
        
        // Save to DB
        let newChatId = null;
        if (req.user) {
            const newChat = await RecentChat.create({
                user: req.user._id,
                title: `MCQs on ${topic}`,
                messages: [
                    { role: 'user', content: `Generate ${numQuestions} MCQs about ${topic} (${difficulty})` },
                    { role: 'assistant', content: JSON.stringify(mcqs) }
                ]
            });
            newChatId = newChat._id;
        }
        
        res.json({ 
            success: true, 
            topic,
            data: mcqs,
            chatId: newChatId
        });
    } catch (error) {
        console.error("Error generating MCQs:", error);
        res.status(500).json({ success: false, error: "Failed to generate MCQs", details: error.message });
    }
};

export const getChatsHistory = async (req, res) => {
    try {
        // Fetch all recent chats for the authenticated user, sorted newest first
        const chats = await RecentChat.find({ user: req.user._id }).sort({ createdAt: -1 });
        
        res.json({ 
            success: true, 
            count: chats.length, 
            data: chats 
        });
    } catch (error) {
        console.error("Error fetching chat history:", error);
        res.status(500).json({ success: false, error: "Failed to fetch chat history", details: error.message });
    }
};

export const generateNotes = async (req, res) => {
    try {
        const { topic } = req.body;
        
        if (!topic) {
            return res.status(400).json({ success: false, error: "Topic is required" });
        }

        const notesMarkdown = await generateNotesService(topic);
        
        let newChatId = null;
        if (req.user) {
            const newChat = await RecentChat.create({
                user: req.user._id,
                title: `Notes on ${topic}`,
                messages: [
                    { role: 'user', content: `Generate notes about ${topic}` },
                    { role: 'assistant', content: notesMarkdown }
                ]
            });
            newChatId = newChat._id;
        }
        
        res.json({ 
            success: true, 
            topic,
            data: notesMarkdown,
            chatId: newChatId
        });
    } catch (error) {
        console.error("Error generating Notes:", error);
        res.status(500).json({ success: false, error: "Failed to generate Notes", details: error.message });
    }
};

export const generateQA = async (req, res) => {
    try {
        const { topic, numQuestions, difficulty = "Medium" } = req.body;
        
        if (!topic) {
            return res.status(400).json({ success: false, error: "Topic is required" });
        }

        const qa = await generateQAService(topic, numQuestions, difficulty);
        
        let newChatId = null;
        if (req.user) {
            const newChat = await RecentChat.create({
                user: req.user._id,
                title: `Q&A on ${topic}`,
                messages: [
                    { role: 'user', content: `Generate ${numQuestions} Q&A about ${topic} (${difficulty})` },
                    { role: 'assistant', content: JSON.stringify(qa) }
                ]
            });
            newChatId = newChat._id;
        }
        
        res.json({ 
            success: true, 
            topic,
            data: qa,
            chatId: newChatId
        });
    } catch (error) {
        console.error("Error generating Q&A:", error);
        res.status(500).json({ success: false, error: "Failed to generate Q&A", details: error.message });
    }
};

export const toggleShareChat = async (req, res) => {
    try {
        const { id } = req.params;
        const chat = await RecentChat.findOne({ _id: id, user: req.user._id });
        
        if (!chat) {
            return res.status(404).json({ success: false, error: "Chat not found" });
        }

        chat.isShared = !chat.isShared;
        await chat.save();

        res.json({ success: true, isShared: chat.isShared });
    } catch (error) {
        console.error("Error toggling share status:", error);
        res.status(500).json({ success: false, error: "Failed to toggle share status", details: error.message });
    }
};

export const getSharedChat = async (req, res) => {
    try {
        const { id } = req.params;
        const chat = await RecentChat.findById(id).populate('user', 'name'); // optionally get creator name

        if (!chat || !chat.isShared) {
            return res.status(404).json({ success: false, error: "Content not found or is private" });
        }

        res.json({ success: true, data: chat });
    } catch (error) {
        console.error("Error fetching shared chat:", error);
        res.status(500).json({ success: false, error: "Failed to fetch shared content", details: error.message });
    }
};

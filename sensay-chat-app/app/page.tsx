'use client';

import { useEffect, useState } from 'react';
import { setupClient, getReplicaId } from '@/lib/sensay';

export default function Home() {
    const [client, setClient] = useState<any>(null);
    const [replicaId, setReplicaId] = useState<string>('');
    const [question, setQuestion] = useState('');
    const [answer, setAnswer] = useState('');

    useEffect(() => {
        const init = async () => {
            const clientInstance = await setupClient();
            setClient(clientInstance);
            const replicaUUID = await getReplicaId(clientInstance);
            setReplicaId(replicaUUID);
        };
        init();
    }, []);

    const askQuestion = async () => {
        if (!client || !replicaId) return;
        const res = await client.chatCompletions.postV1ReplicasChatCompletions(
            replicaId,
            '2025-03-25',
            {
                content: question,
                source: 'web',
                skip_chat_history: false
            }
        );
        setAnswer(res.content);
    };

    return (
        <main className="p-8 max-w-xl mx-auto">
            <h1 className="text-2xl font-bold mb-4">🎓 Science Hub</h1>
            <input
                className="border w-full p-2 mb-2"
                placeholder="Ask me about AI, programming, math..."
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
            />
            <button
                className="bg-blue-600 text-white px-4 py-2 rounded"
                onClick={askQuestion}
            >
                Ask
            </button>
            {answer && (
                <div className="mt-4 p-4 bg-gray-100 rounded">
                    <strong>Answer:</strong> {answer}
                </div>
            )}
        </main>
    );
}
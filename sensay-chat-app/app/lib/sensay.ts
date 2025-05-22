'use client';

import { SensayAPI } from 'sensay-sdk';
import { API_VERSION, SAMPLE_USER_ID, SAMPLE_REPLICA_SLUG } from '@/constants/auth';

const orgClient = new SensayAPI({
    HEADERS: {
        'X-ORGANIZATION-SECRET': process.env.NEXT_PUBLIC_SENSAY_API_KEY_SECRET || ''
    }
});

export const setupClient = async () => {
    try {
        await orgClient.users.getV1Users(SAMPLE_USER_ID);
    } catch {
        await orgClient.users.postV1Users(API_VERSION, {
            id: SAMPLE_USER_ID,
            email: `${SAMPLE_USER_ID}@example.com`,
            name: 'Science Hub User'
        });
    }

    const client = new SensayAPI({
        HEADERS: {
            'X-ORGANIZATION-SECRET': process.env.NEXT_PUBLIC_SENSAY_API_KEY_SECRET || '',
            'X-USER-ID': SAMPLE_USER_ID
        }
    });

    return client;
};

export const getReplicaId = async (client: any) => {
    const replicas = await client.replicas.getV1Replicas();
    const found = replicas.items.find((r: any) => r.slug === SAMPLE_REPLICA_SLUG);
    if (found) return found.uuid;

    const newReplica = await client.replicas.postV1Replicas(API_VERSION, {
        name: 'Science Hub',
        shortDescription: 'AI tutor for university tech disciplines',
        greeting: 'Welcome to Science Hub! Ask me about programming, AI, engineering, and more.',
        slug: SAMPLE_REPLICA_SLUG,
        ownerID: SAMPLE_USER_ID,
        llm: {
            model: 'gpt-4o',
            memoryMode: 'prompt-caching',
            systemMessage: 'You are an AI tutor specializing in tech-related university subjects like computer science, engineering, and AI.'
        }
    });

    return newReplica.uuid;
};
export type FindAllResponse = {
    data: {
        id: string;
        title: string;
        description: string;
        type: string;
        userId: string;
        createdAt: Date;
    }[];
    total_items: number;
    offset: number;
    limit: number;
};

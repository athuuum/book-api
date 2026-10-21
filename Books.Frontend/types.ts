export type Book = {
    id: number;
    title: string;
    author: {
        id: number;
        name: string;
    };
    publishedDate: string;
};
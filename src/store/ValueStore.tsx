import { create } from 'zustand';

export interface StoredItem {
    type: string;
    number: number;
    nameType: string;
    voiceType: string;
    voiceValue: number;
}
export interface ChangableItem {
    type: string;
    number: number;
}

interface ValueStore {
    storedValue: StoredItem[];
    changableValue: StoredItem[];
    setStoredValue: (item: StoredItem) => void;
    setChangableValue: (item: StoredItem) => void;
    deleteStoredValue: (idx: number) => void;
    deleteChangableValue: (idx: number) => void;
}

const initialValue: StoredItem[] = [
    {
        type: '남자',
        number: 1,
        nameType: '지안',
        voiceType: 'normal',
        voiceValue: 1,
    },
    {
        type: '남자',
        number: 2,
        nameType: '우주',
        voiceType: 'angry',
        voiceValue: 2,
    },
    {
        type: '남자',
        number: 5,
        nameType: '지안',
        voiceType: 'normal',
        voiceValue: 1,
    },
    {
        type: '남자',
        number: 7,
        nameType: '준호',
        voiceType: 'angry',
        voiceValue: 3,
    },
    {
        type: '남자',
        number: 15,
        nameType: '베리',
        voiceType: 'normal',
        voiceValue: 1,
    },
    {
        type: '남자',
        number: 16,
        nameType: '준호',
        voiceType: 'angry',
        voiceValue: 3,
    },
    {
        type: '남자',
        number: 17,
        nameType: '창배',
        voiceType: 'happy',
        voiceValue: 1,
    },
    {
        type: '남자',
        number: 22,
        nameType: '창배',
        voiceType: 'happy',
        voiceValue: 1,
    },
    {
        type: '여자',
        number: 1,
        nameType: '베리',
        voiceType: 'normal',
        voiceValue: 1,
    },
    {
        type: '여자',
        number: 3,
        nameType: '베리',
        voiceType: 'normal',
        voiceValue: 1,
    },
];

const initialChangableValue: StoredItem[] = [];

export const useValueStore = create<ValueStore>((set) => ({
    storedValue: initialValue,
    changableValue: initialChangableValue,
    setStoredValue: (item: StoredItem) => set((state) => ({ storedValue: [...state.storedValue, item] })),
    setChangableValue: (item: StoredItem) => set((state) => ({ changableValue: [...state.changableValue, item] })),
    deleteStoredValue: (idx: number) => set((state) => ({ storedValue: state.storedValue.filter((_, index) => index !== idx) })),
    deleteChangableValue: (idx: number) => set((state) => ({ changableValue: state.changableValue.filter((_, index) => index !== idx) })),
}));

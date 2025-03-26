import { create } from 'zustand';

export interface StoredItem {
    type: string;
    number: number;
    nameType: string;
    voiceType: string;
    voiceValue: number;
    originalText?: string[];
}
export interface ChangableItem {
    type: string;
    number: number;
}

interface ValueStore {
    storedValue: StoredItem[];
    changableValue: ChangableItem[];
    setStoredValue: (item: StoredItem) => void;
    setChangableValue: (item: ChangableItem) => void;
    deleteStoredValue: (idx: number) => void;
    deleteChangableValue: (idx: number) => void;
}

const initialValue: StoredItem[] = [
    {
        type: '남자',
        number: 1,
        nameType: '우주',
        voiceType: 'angry',
        voiceValue: 1,
    },
    {
        type: '남자',
        number: 2,
        nameType: '준호',
        voiceType: 'normal',
        voiceValue: 3,
    },
    {
        type: '남자',
        number: 3,
        nameType: '지안',
        voiceType: 'toneup',
        voiceValue: 1,
    },
    {
        type: '남자',
        number: 4,
        nameType: '창배',
        voiceType: 'happy',
        voiceValue: 1,
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
        number: 16,
        nameType: '지안',
        voiceType: 'sad',
        voiceValue: 1,
    },
    {
        type: '여자',
        number: 1,
        nameType: '베리',
        voiceType: 'normal',
        voiceValue: 2,
    },
    {
        type: '여자',
        number: 2,
        nameType: '지안',
        voiceType: 'happy',
        voiceValue: 1,
    },
    {
        type: '남자',
        number: 9,
        nameType: '준호',
        voiceType: 'angry',
        voiceValue: 1,
    },
];

const initialChangableValue: ChangableItem[] = [
    {
        type: '남자아이',
        number: 11,
    },
    {
        type: '남자아이',
        number: 12,
    },
    {
        type: '할아버지',
        number: 13,
    },
    {
        type: '여자아이',
        number: 4,
    },
    {
        type: '남자아이',
        number: 18,
    },
    {
        type: '남자아이',
        number: 26,
    },
    {
        type: '남자아이',
        number: 29,
    },
    {
        type: '남자아이',
        number: 30,
    },
    {
        type: '할아버지',
        number: 32,
    },
    {
        type: '할아버지',
        number: 33,
    },
    {
        type: '할아버지',
        number: 34,
    },
    {
        type: '남자아이',
        number: 35,
    },
    {
        type: '남자아이',
        number: 36,
    },
    {
        type: '남자아이',
        number: 37,
    },
    {
        type: '남자아이',
        number: 38,
    },
];

export const useValueStore = create<ValueStore>((set) => ({
    storedValue: initialValue,
    changableValue: initialChangableValue,
    setStoredValue: (item: StoredItem) => set((state) => ({ storedValue: [...state.storedValue, item] })),
    setChangableValue: (item: ChangableItem) => set((state) => ({ changableValue: [...state.changableValue, item] })),
    deleteStoredValue: (idx: number) => set((state) => ({ storedValue: state.storedValue.filter((_, index) => index !== idx) })),
    deleteChangableValue: (idx: number) => set((state) => ({ changableValue: state.changableValue.filter((_, index) => index !== idx) })),
}));

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
        voiceType: 'sad',
        voiceValue: 1,
    },
    {
        type: '남자',
        number: 7,
        nameType: '준호',
        voiceType: 'normal',
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
        voiceValue: 2,
    },
    {
        type: '여자',
        number: 3,
        nameType: '베리',
        voiceType: 'normal',
        voiceValue: 3,
    },
];

const initialChangableValue: ChangableItem[] = [
    {
        type: '남자아이',
        number: 25,
    },
    {
        type: '남자아이',
        number: 26,
    },
    {
        type: '남자아이',
        number: 27,
    },
    {
        type: '남자아이',
        number: 28,
    },
    {
        type: '할아버지',
        number: 29,
    },
    {
        type: '남자아이',
        number: 30,
    },
    {
        type: '남자아이',
        number: 31,
    },
    {
        type: '남자아이',
        number: 32,
    },
    {
        type: '할아버지',
        number: 8,
    },
    {
        type: '남자아이',
        number: 41,
    },
    {
        type: '남자아이',
        number: 42,
    },
    {
        type: '남자아이',
        number: 43,
    },
    {
        type: '남자아이',
        number: 44,
    },
    {
        type: '남자아이',
        number: 45,
    },
    {
        type: '남자아이',
        number: 46,
    },
    {
        type: '남자아이',
        number: 48,
    },
    {
        type: '남자아이',
        number: 49,
    },
    {
        type: '남자아이',
        number: 50,
    },
    {
        type: '여자아이',
        number: 2,
    },
    {
        type: '여자아이',
        number: 8,
    },
    {
        type: '여자아이',
        number: 9,
    },
    {
        type: '여자아이',
        number: 10,
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

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

const initialValue = [
    {
        type: '남자',
        number: 4, //444444444
        nameType: '우주',
        voiceType: 'angry',
        voiceValue: 2,
    },
    {
        type: '남자',
        number: 9, // 999999999
        nameType: '준호',
        voiceType: 'normal',
        voiceValue: 3,
    },
    {
        type: '남자',
        number: 23, //// 23 23  23 23
        nameType: '준호',
        voiceType: 'angry',
        voiceValue: 1,
    },
    {
        type: '남자',
        number: 5, // 55555555
        nameType: '지안',
        voiceType: 'sad',
        voiceValue: 1,
    },
    {
        type: '남자',
        number: 1, // 111111111
        nameType: '지안',
        voiceType: 'normal',
        voiceValue: 1,
    },
    {
        type: '남자',
        number: 2, // 22222222
        nameType: '지안',
        voiceType: 'toneup',
        voiceValue: 1,
    },
    {
        type: '여자',
        number: 3, // 3333333
        nameType: '베리',
        voiceType: 'normal',
        voiceValue: 2,
    },
    {
        type: '여자',
        number: 2, // 2222222
        nameType: '지안',
        voiceType: 'happy',
        voiceValue: 1,
    },
    {
        type: '여자',
        number: 1, // 111111
        nameType: '지안',
        voiceType: 'sad',
        voiceValue: 2,
    },
];

const initialChangableValue: ChangableItem[] = [
    {
        type: '남자아이',
        number: 3,
    },
    {
        type: '남자아이',
        number: 7,
    },
    {
        type: '남자아이',
        number: 8,
    },
    {
        type: '남자아이',
        number: 10,
    },
    {
        type: '남자아이',
        number: 11,
    },
    {
        type: '남자아이',
        number: 13,
    },
    {
        type: '남자아이',
        number: 14,
    },
    {
        type: '남자아이',
        number: 15,
    },
    {
        type: '남자아이',
        number: 16,
    },
    {
        type: '남자아이',
        number: 18,
    },
    {
        type: '남자아이',
        number: 19,
    },
    {
        type: '남자아이',
        number: 24,
    },
    {
        type: '여자아이',
        number: 5,
    },
    {
        type: '여자아이',
        number: 6,
    },
    {
        type: '여자아이',
        number: 7,
    },
    {
        type: '여자아이',
        number: 8,
    },
    {
        type: '할아버지',
        number: 20,
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
    {
        type: '남자',
        number: 122133123,
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

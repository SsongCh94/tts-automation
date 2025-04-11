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
        number: 1, // 강무한
        nameType: '우주',
        voiceType: 'angry',
        voiceValue: 2,
    },
    {
        type: '남자',
        number: 2, // 공수식
        nameType: '준호',
        voiceType: 'normal',
        voiceValue: 3,
    },
    {
        type: '남자',
        number: 3, // 금발머리
        nameType: '우주',
        voiceType: 'sad',
        voiceValue: 1,
    },
    {
        type: '남자',
        number: 4, // 교육부 장관
        nameType: '창배',
        voiceType: 'happy',
        voiceValue: 1,
    },
    {
        type: '남자',
        number: 5, // 캠프장
        nameType: '준호',
        voiceType: 'toneup',
        voiceValue: 1,
    },
    {
        type: '남자',
        number: 6, // 우호진
        nameType: '지안',
        voiceType: 'normal',
        voiceValue: 1,
    },
    {
        type: '남자',
        number: 7, // 태빈
        nameType: '지안',
        voiceType: 'toneup',
        voiceValue: 1,
    },
    {
        type: '남자',
        number: 8, // 안경태
        nameType: '지안',
        voiceType: 'sad',
        voiceValue: 1,
    },
    {
        type: '남자',
        number: 16, // 교장
        nameType: '창배',
        voiceType: 'happy',
        voiceValue: 1,
    },
    {
        type: '남자',
        number: 19, // 뿔태선생
        nameType: '준호',
        voiceType: 'toneup',
        voiceValue: 3,
    },
    {
        type: '여자',
        number: 1, // 나새리
        nameType: '베리',
        voiceType: 'normal',
        voiceValue: 2,
    },
    {
        type: '여자',
        number: 2, // 하소연
        nameType: '지안',
        voiceType: 'happy',
        voiceValue: 1,
    },
    {
        type: '여자',
        number: 3, // 안경여자아이
        nameType: '지안',
        voiceType: 'tonemid',
        voiceValue: 2,
    },
    {
        type: '여자',
        number: 4, // 여선생
        nameType: '지안',
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
        type: '남자아이',
        number: 15,
    },
    {
        type: '남자아이',
        number: 18,
    },
    {
        type: '남자아이',
        number: 22,
    },
    {
        type: '남자아이',
        number: 23,
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
];

export const useValueStore = create<ValueStore>((set) => ({
    storedValue: initialValue,
    changableValue: initialChangableValue,
    setStoredValue: (item: StoredItem) => set((state) => ({ storedValue: [...state.storedValue, item] })),
    setChangableValue: (item: ChangableItem) => set((state) => ({ changableValue: [...state.changableValue, item] })),
    deleteStoredValue: (idx: number) => set((state) => ({ storedValue: state.storedValue.filter((_, index) => index !== idx) })),
    deleteChangableValue: (idx: number) => set((state) => ({ changableValue: state.changableValue.filter((_, index) => index !== idx) })),
}));

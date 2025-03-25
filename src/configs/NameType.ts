export interface DetailType {
    sex: string[];
    voiceType: {
        angry?: number[];
        normal?: number[];
        soft?: number[];
        tonemid?: number[];
        toneup?: number[];
        happy?: number[];
        sad?: number[];
    };
}

export type VoiceType = keyof DetailType['voiceType'];

interface NameType {
    [key: string]: DetailType;
}

export const NameType: NameType = {
    준호: {
        sex: ['남자', '남자아이'],
        voiceType: {
            angry: [1, 2, 3, 4],
            normal: [1, 2, 3, 4],
            soft: [1, 2, 3, 4],
            tonemid: [1, 2, 3],
            toneup: [1, 2, 3, 4],
        },
    },
    베리: {
        sex: ['여자아이', '동물'],
        voiceType: {
            normal: [1, 2, 3],
        },
    },
    지안: {
        sex: ['여자', '여자아이', '남자아이'],
        voiceType: {
            angry: [1, 2, 3, 4],
            normal: [1, 2, 3],
            tonemid: [1, 2, 3, 4],
            toneup: [1, 2, 3, 4],
            happy: [1, 2, 3, 4],
            sad: [1, 2],
        },
    },
    우주: {
        sex: ['남자아이'],
        voiceType: {
            angry: [1, 2],
            normal: [1, 2, 3],
            happy: [1, 2, 3, 4],
            sad: [1, 2, 3, 4],
        },
    },
    창배: {
        sex: ['할아버지'],
        voiceType: {
            angry: [1, 2, 3, 4],
            normal: [1, 2, 3, 4],
            happy: [1, 2, 3, 4],
            sad: [1, 2, 3, 4],
        },
    },
};

export const SexType = ['남자', '여자'];
export const ChangableSexType = ['남자', '여자', '남자아이', '여자아이', '할아버지', '동물'];

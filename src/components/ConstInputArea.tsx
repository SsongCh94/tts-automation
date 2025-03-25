'use client';
import React from 'react';
import { NameType, SexType, VoiceType } from '@/configs/NameType';
import { useValueStore } from '@/store/ValueStore';

const ConstInputArea: React.FC = () => {
    const [type, setType] = React.useState<string>('남자');
    const [number, setNumber] = React.useState<number>(1);
    const [nameType, setNameType] = React.useState<string>('준호');
    const [voiceType, setVoiceType] = React.useState<VoiceType>('angry');
    const [voiceValue, setVoiceValue] = React.useState<number>(1);

    const { setStoredValue } = useValueStore();

    const handleAddConst = () => {
        setStoredValue({
            type: type,
            number: number,
            nameType: nameType,
            voiceType: voiceType,
            voiceValue: voiceValue,
        });
    };

    const onNameChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setNameType(e.target.value);
        setVoiceType(Object.keys(NameType[e.target.value].voiceType)[0] as VoiceType);
    };

    const onVoiceTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setVoiceType(e.target.value as VoiceType);
        setVoiceValue(1);
    };

    return (
        <div>
            <select
                name="type"
                id="type"
                onChange={(e) => setType(e.target.value)}
                style={{ margin: '10px 20px 10px 0px', fontSize: '24px', width: '100px' }}
            >
                {SexType.map((type, idx) => (
                    <option key={idx} value={type}>
                        {type}
                    </option>
                ))}
            </select>
            <select
                name="number"
                id="number"
                onChange={(e) => setNumber(Number(e.target.value))}
                style={{ margin: '10px 20px 10px 0px', fontSize: '24px', width: '100px' }}
            >
                {Array.from({ length: 50 }, (_, index) => index + 1).map((num) => (
                    <option key={num} value={num}>
                        {num}
                    </option>
                ))}
            </select>
            <select
                name="nameType"
                id="nameType"
                onChange={(e) => onNameChange(e)}
                style={{ margin: '10px 20px 10px 0px', fontSize: '24px', width: '100px' }}
            >
                {Object.keys(NameType).map((name, idx) => (
                    <option key={idx} value={name}>
                        {name}
                    </option>
                ))}
            </select>
            <select
                name="voiceType"
                id="voiceType"
                onChange={(e) => onVoiceTypeChange(e)}
                style={{ margin: '10px 20px 10px 0px', fontSize: '24px', width: '100px' }}
            >
                {Object.keys(NameType[nameType].voiceType).map((voice, idx) => (
                    <option key={idx} value={voice}>
                        {voice}
                    </option>
                ))}
            </select>

            <select
                name="voiceValue"
                id="voiceValue"
                onChange={(e) => setVoiceValue(Number(e.target.value))}
                style={{ margin: '10px 20px 10px 0px', fontSize: '24px', width: '100px' }}
            >
                {NameType[nameType].voiceType[voiceType as keyof (typeof NameType)[string]['voiceType']]?.map((value: number, idx: number) => (
                    <option key={idx} value={value}>
                        {value}
                    </option>
                ))}
            </select>

            <button onClick={handleAddConst} style={{ fontSize: '24px', width: '100px' }}>
                추가
            </button>
        </div>
    );
};

export default ConstInputArea;

'use client';
import React from 'react';
import { ChangableSexType, VoiceType, NameType } from '@/configs/NameType';
import { useValueStore } from '@/store/ValueStore';

const ChangeInputArea: React.FC = () => {
    const [type, setType] = React.useState<string>('남자');
    const [number, setNumber] = React.useState<number>(1);

    const { storedValue, changableValue, setChangableValue } = useValueStore();

    const totalValue = storedValue.concat(changableValue);
    const handleAddConst = () => {
        // 중복 체크를 위한 변수
        const existingNames = new Set(totalValue.map((item) => item.nameType));
        const existingVoiceTypes = new Set(totalValue.map((item) => item.voiceType));
        const existingVoiceValues = new Set(totalValue.map((item) => item.voiceValue));

        // 가능한 nameType 중에서 중복되지 않는 것을 찾기
        const availableNames = Object.keys(NameType).filter(
            (name) => NameType[name].sex.includes(type) && !existingNames.has(name) // type에 맞고 중복되지 않는 nameType 필터링
        );

        // 랜덤으로 nameType 선택
        let selectedNameType = availableNames.length > 0 ? availableNames[Math.floor(Math.random() * availableNames.length)] : null;

        // nameType이 중복된 경우, 같은 nameType의 다른 voiceType을 찾기
        if (!selectedNameType) {
            const allNames = Object.keys(NameType).filter((name) => NameType[name].sex.includes(type));
            selectedNameType = allNames[Math.floor(Math.random() * allNames.length)];
        }

        console.log('<ssong> existingNames   ::', existingNames);
        console.log('<ssong> existingVoiceTypes   ::', existingVoiceTypes);
        console.log('<ssong> existingVoiceValues   ::', existingVoiceValues);
        // 랜덤으로 voiceType 선택
        const availableVoiceTypes = selectedNameType ? Object.keys(NameType[selectedNameType].voiceType) : [];
        const filteredVoiceTypes = availableVoiceTypes.filter((voice) => !existingVoiceTypes.has(voice));
        let selectedVoiceType = filteredVoiceTypes.length > 0 ? filteredVoiceTypes[Math.floor(Math.random() * filteredVoiceTypes.length)] : null;

        // voiceType이 중복된 경우, 같은 nameType의 다른 voiceType을 찾기
        if (!selectedVoiceType) {
            selectedVoiceType = availableVoiceTypes[Math.floor(Math.random() * availableVoiceTypes.length)];
        }

        // 랜덤으로 voiceValue 선택
        const availableVoiceValues =
            selectedNameType && selectedVoiceType ? NameType[selectedNameType].voiceType[selectedVoiceType as VoiceType] || [] : [];
        const filteredVoiceValues = availableVoiceValues.filter((value) => !existingVoiceValues.has(value));
        let selectedVoiceValue = filteredVoiceValues.length > 0 ? filteredVoiceValues[Math.floor(Math.random() * filteredVoiceValues.length)] : null;

        // voiceValue가 중복된 경우, 같은 voiceType의 다른 voiceValue를 찾기
        if (!selectedVoiceValue) {
            selectedVoiceValue = availableVoiceValues[Math.floor(Math.random() * availableVoiceValues.length)];
        }

        // 최종적으로 저장
        if (selectedNameType && selectedVoiceType && selectedVoiceValue !== null) {
            setChangableValue({
                type: type === '남자' || type === '남자아이' || type === '할아버지' ? '남자' : '여자',
                number: number,
                nameType: selectedNameType,
                voiceType: selectedVoiceType,
                voiceValue: selectedVoiceValue,
            });
        }
    };

    // 사용 가능한 숫자 필터링
    const usedNumbers = new Set(
        totalValue
            .filter((item) => item.type === (type === '남자' || type === '남자아이' || type === '할아버지' ? '남자' : '여자'))
            .map((item) => item.number)
    );

    return (
        <div>
            <select
                name="type"
                id="type"
                onChange={(e) => setType(e.target.value)}
                style={{ margin: '10px 20px 10px 0px', fontSize: '24px', width: '100px' }}
            >
                {ChangableSexType.map((type, idx) => (
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
                {Array.from({ length: 100 }, (_, index) => index + 1)
                    .filter((num) => !usedNumbers.has(num))
                    .map((num) => (
                        <option key={num} value={num}>
                            {num}
                        </option>
                    ))}
            </select>
            <button onClick={handleAddConst} style={{ fontSize: '24px', width: '100px' }}>
                추가
            </button>
        </div>
    );
};

export default ChangeInputArea;

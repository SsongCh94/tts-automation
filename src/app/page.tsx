'use client';

import styles from './page.module.css';
import React from 'react';
import ConstInputArea from '@/components/ConstInputArea';
import ChangeInputArea from '@/components/ChangeInputArea';
import { useValueStore } from '@/store/ValueStore';
import { totalCharacter } from '@/configs/TotalCharacter';
import { NameType, VoiceType } from '@/configs/NameType';

export default function Home() {
    const [characterLine, setCharacterLine] = React.useState<string>('Q4');

    const [generatedCharacterLine, setGeneratedCharacterLine] = React.useState<string>('');
    const [generatedVoiceLine, setGeneratedVoiceLine] = React.useState<string>('');

    const { storedValue, deleteStoredValue, changableValue, deleteChangableValue } = useValueStore();

    const handleGenerate = () => {
        if (!characterLine) {
            alert(`'남자1' 등이 있는 문자열, 최상단 행 입력 필요.`);
            return;
        }

        const hasEmptyValue = storedValue.some(
            (item) => item.type === '' || item.number === 0 || item.nameType === '' || item.voiceType === '' || item.voiceValue === 0
        );
        if (storedValue.length === 0 || hasEmptyValue) {
            alert('고정값 또는 변동값 입력 필요.');
            return;
        }

        // 중복 제거된 totalCharacter 배열 생성
        const uniqueCharacters = Array.from(new Set(totalCharacter));

        // 각 캐릭터를 분석하여 type과 number로 분리
        const characterDetails = uniqueCharacters
            .map((char) => {
                // 원본 문자열 저장
                const originalText = char;

                // 콤마로 분리되어 있는 경우 첫 번째 캐릭터만 사용
                const firstChar = char.split(',')[0].trim();

                // '남자17'에서 '남자'와 '17' 분리
                const match = firstChar.match(/([가-힣]+)(\d+)/);
                if (match) {
                    return {
                        // 무조건 남자 또는 여자로 구분
                        type: match[1] === '남자' || match[1] === '여자' ? match[1] : '기타',
                        number: parseInt(match[2]),
                        voiceType: match[1], // 원래 타입을 voiceType으로 저장
                        originalText: originalText, // 원본 문자열 저장
                    };
                }
                return null;
            })
            .filter(Boolean);

        // 이미 사용된 조합을 추적할 Set
        const usedCombinations = new Set();

        // 기존 storedValue의 조합을 먼저 추가
        storedValue.forEach((item) => {
            usedCombinations.add(`${item.nameType}-${item.voiceType}`);
            usedCombinations.add(`${item.nameType}-${item.voiceType}-${item.voiceValue}`);
        });

        // 모든 캐릭터 정보 생성
        const processedCharacters = characterDetails.reduce((acc: any, detail) => {
            // initialValue에 있는지 확인
            const existingInStored = storedValue.find((item) => item.type === detail?.type && item.number === detail?.number);

            // changableValue에 있는지 확인
            const existingInChangable = changableValue.find(
                (item) =>
                    (item.type === '남자' || item.type === '남자아이' || item.type === '할아버지' ? '남자' : '여자') === detail?.type &&
                    item.number === detail?.number
            );

            if (existingInStored) {
                // 이미 storedValue에 있으면 그대로 사용
                acc.push(existingInStored);
                usedCombinations.add(`${existingInStored.nameType}-${existingInStored.voiceType}`);
                usedCombinations.add(`${existingInStored.nameType}-${existingInStored.voiceType}-${existingInStored.voiceValue}`);
                return acc;
            } else if (existingInChangable) {
                // changableValue에 있으면, 해당 타입과 번호를 사용하여 새로운 캐릭터 생성
                const baseType = detail?.type;

                // 변동값에 지정된 타입(할아버지 등)을 고려하여 nameType 선택
                const voiceTypeForSelection = existingInChangable.type; // 할아버지, 여자아이 등
                const availableNames = Object.keys(NameType).filter((name) => NameType[name].sex.includes(voiceTypeForSelection));
                // 가장 적게 사용된 nameType 찾기
                const leastUsedNameType = availableNames.reduce((least, current) => {
                    // 정확히 nameType만 매칭되도록 수정
                    const leastCount = Array.from(usedCombinations).filter((combo: any) => combo === least || combo.startsWith(`${least}-`)).length;
                    const currentCount = Array.from(usedCombinations).filter(
                        (combo: any) => combo === current || combo.startsWith(`${current}-`)
                    ).length;

                    // 모든 값의 length가 같을 경우 랜덤하게 선택
                    if (leastCount === currentCount) {
                        return Math.random() < 0.5 ? current : least;
                    }

                    return currentCount < leastCount ? current : least;
                }, availableNames[0]);

                // voiceType 선택 - 이미 사용된 nameType에 대해 중복되지 않는 voiceType 선택
                const availableVoiceTypes = Object.keys(NameType[leastUsedNameType].voiceType);
                const leastUsedVoiceType = availableVoiceTypes.reduce((least, current) => {
                    const leastCount = Array.from(usedCombinations).filter(
                        (combo: any) => combo.startsWith(leastUsedNameType) && combo.includes(least)
                    ).length;
                    const currentCount = Array.from(usedCombinations).filter(
                        (combo: any) => combo.startsWith(leastUsedNameType) && combo.includes(current)
                    ).length;

                    // 모든 값의 length가 같을 경우 랜덤하게 선택
                    if (leastCount === currentCount) {
                        return Math.random() < 0.5 ? current : least;
                    }

                    return currentCount < leastCount ? current : least;
                }, availableVoiceTypes[0]);

                // voiceValue 선택 - 가장 적게 사용된 조합 찾기
                const availableVoiceValues = NameType[leastUsedNameType].voiceType[leastUsedVoiceType as VoiceType] || [];
                console.log('<ssong> availableNames   ::', availableNames);
                console.log('<ssong> target   ::', (detail?.type as string) + detail?.number);
                console.log('<ssong> availableVoiceValues   ::', availableVoiceValues);
                console.log('<ssong> leastUsedNameType   ::', leastUsedNameType);
                console.log('<ssong> leastUsedVoiceType   ::', leastUsedVoiceType);
                console.log('<ssong> usedCombinations   ::', usedCombinations);
                const leastUsedVoiceValue = availableVoiceValues.reduce((least, current) => {
                    // 현재 nameType과 voiceType에 대해서만 voiceValue 사용 횟수를 계산
                    const leastCount = Array.from(usedCombinations).filter((combo: any) =>
                        combo.startsWith(`${leastUsedNameType}-${leastUsedVoiceType}-${least}`)
                    ).length;
                    const currentCount = Array.from(usedCombinations).filter((combo: any) =>
                        combo.startsWith(`${leastUsedNameType}-${leastUsedVoiceType}-${current}`)
                    ).length;

                    // 모든 값의 length가 같을 경우 랜덤하게 선택
                    if (leastCount === currentCount) {
                        return Math.random() < 0.5 ? current : least;
                    }

                    return currentCount < leastCount ? current : least;
                }, availableVoiceValues[0]);

                console.log('<ssong> 사용됨   ::', `${leastUsedNameType}-${leastUsedVoiceType}-${leastUsedVoiceValue}`);
                // 사용된 조합 추가
                usedCombinations.add(`${leastUsedNameType}-${leastUsedVoiceType}`);
                usedCombinations.add(`${leastUsedNameType}-${leastUsedVoiceType}-${leastUsedVoiceValue}`);

                const containedMainChar = storedValue.find((item) => {
                    return `${item.type}${item.number}` === `${detail?.type}${detail?.number}`;
                });
                const containedSubChar = acc?.find((item: any) => item.originalText === `${detail?.type}${detail?.number}`);

                if (detail?.originalText && detail?.originalText.length > 0 && (containedMainChar || containedSubChar)) {
                    const containedChar = containedMainChar || containedSubChar;
                    acc.push({
                        type: containedChar.type,
                        number: containedChar.number,
                        nameType: containedChar.nameType,
                        voiceType: containedChar.voiceType,
                        voiceValue: containedChar.voiceValue,
                        originalText: detail?.originalText,
                    });
                    return acc;
                }

                acc.push({
                    type: baseType,
                    number: detail?.number,
                    nameType: leastUsedNameType,
                    voiceType: leastUsedVoiceType,
                    voiceValue: leastUsedVoiceValue,
                    originalText: detail?.originalText,
                });
            } else {
                // 둘 다 없는 경우 기본 캐릭터 생성
                const baseType = detail?.type; // 남자 또는 여자
                console.log('<ssong> detail   ::', detail);

                // 남자/여자에 맞는 기본 nameType 선택
                // 남자는 어린이와 할아버지가 아닌 캐릭터, 여자는 여자아이가 아닌 캐릭터
                const availableNames = Object.keys(NameType).filter((name) => {
                    const sexTypes = NameType[name].sex;
                    if (baseType === '남자') {
                        return sexTypes.includes('남자');
                    } else {
                        return sexTypes.includes('여자');
                    }
                });

                // 가장 적게 사용된 nameType 찾기
                const leastUsedNameType = availableNames.reduce((least: any, current) => {
                    // 정확히 nameType만 매칭되도록 수정
                    const leastCount = Array.from(usedCombinations).filter((combo: any) => combo === least || combo.startsWith(`${least}-`)).length;
                    const currentCount = Array.from(usedCombinations).filter(
                        (combo: any) => combo === current || combo.startsWith(`${current}-`)
                    ).length;

                    // 모든 값의 length가 같을 경우 랜덤하게 선택
                    if (leastCount === currentCount) {
                        return Math.random() < 0.5 ? current : least;
                    }

                    return currentCount < leastCount ? current : least;
                }, availableNames[0]);
                // voiceType 선택 - 가장 적게 사용된 voiceType 찾기
                const availableVoiceTypes = Object.keys(NameType[leastUsedNameType ?? baseType].voiceType);
                const leastUsedVoiceType = availableVoiceTypes.reduce((least, current) => {
                    const leastCount = Array.from(usedCombinations).filter(
                        (combo: any) => combo.startsWith(leastUsedNameType) && combo.includes(least)
                    ).length;
                    const currentCount = Array.from(usedCombinations).filter(
                        (combo: any) => combo.startsWith(leastUsedNameType) && combo.includes(current)
                    ).length;

                    // 모든 값의 length가 같을 경우 랜덤하게 선택
                    if (leastCount === currentCount) {
                        return Math.random() < 0.5 ? current : least;
                    }

                    return currentCount < leastCount ? current : least;
                }, availableVoiceTypes[0]);

                // voiceValue 선택 - 가장 적게 사용된 조합 찾기
                const availableVoiceValues = NameType[leastUsedNameType].voiceType[leastUsedVoiceType as VoiceType] || [];
                const leastUsedVoiceValue = availableVoiceValues.reduce((least, current) => {
                    // 현재 nameType과 voiceType에 대해서만 voiceValue 사용 횟수를 계산
                    const leastCount = Array.from(usedCombinations).filter((combo: any) =>
                        combo.startsWith(`${leastUsedNameType}-${leastUsedVoiceType}-${least}`)
                    ).length;
                    const currentCount = Array.from(usedCombinations).filter((combo: any) =>
                        combo.startsWith(`${leastUsedNameType}-${leastUsedVoiceType}-${current}`)
                    ).length;

                    // 모든 값의 length가 같을 경우 랜덤하게 선택
                    if (leastCount === currentCount) {
                        return Math.random() < 0.5 ? current : least;
                    }

                    return currentCount < leastCount ? current : least;
                }, availableVoiceValues[0]);

                const containedMainChar = storedValue.find((item) => {
                    return `${item.type}${item.number}` === `${detail?.type}${detail?.number}`;
                });
                const containedSubChar = acc?.find((item: any) => item.originalText === `${detail?.type}${detail?.number}`);

                // 사용된 조합 추가
                usedCombinations.add(`${leastUsedNameType}-${leastUsedVoiceType}`);
                usedCombinations.add(`${leastUsedNameType}-${leastUsedVoiceType}-${leastUsedVoiceValue}`);

                if (detail?.originalText && detail?.originalText.length > 0 && (containedMainChar || containedSubChar)) {
                    const containedChar = containedMainChar || containedSubChar;
                    acc.push({
                        type: containedChar.type,
                        number: containedChar.number,
                        nameType: containedChar.nameType,
                        voiceType: containedChar.voiceType,
                        voiceValue: containedChar.voiceValue,
                        originalText: detail?.originalText,
                    });
                    return acc;
                }

                acc.push({
                    type: baseType,
                    number: detail?.number,
                    nameType: leastUsedNameType,
                    voiceType: leastUsedVoiceType,
                    voiceValue: leastUsedVoiceValue,
                    originalText: detail?.originalText,
                });
            }
            return acc;
        }, []); // null 제거

        const getResult = (type: 'character' | 'voice') => {
            return processedCharacters.reduce((acc: string, curr: any, idx: number) => {
                // 원본 문자열이 있으면 사용, 없으면 type+number 사용
                const characterKey = curr?.originalText || `${curr?.type}${curr?.number}`;

                acc += `${characterLine}="${characterKey}", "${type === 'character' ? curr?.nameType : `${curr?.voiceType}-${curr?.voiceValue}`}"${
                    idx === processedCharacters.length - 1 ? '' : ', '
                }`;
                return acc;
            }, '');
        };

        setGeneratedCharacterLine(`=ARRAY_CONSTRAIN(ARRAYFORMULA(IFERROR(IFS(${getResult('character')}),"기타")), 1, 1)`);
        setGeneratedVoiceLine(`=ARRAY_CONSTRAIN(ARRAYFORMULA(IFERROR(IFS(${getResult('voice')}),"기타")), 1, 1)`);
    };

    const handleDelete = (idx: number) => {
        deleteStoredValue(idx);
    };

    const clickSaveConst = () => {
        console.log('<ssong> storedValue   ::', storedValue);
        console.log('<ssong> changableValue   ::', changableValue);
    };

    return (
        <div className={styles.page}>
            <main className={styles.main}>
                <div>
                    <h1>사용된 캐릭터</h1>
                    {storedValue.map((value, idx) => (
                        <div key={idx}>
                            {value.type} {value.number}
                        </div>
                    ))}
                </div>
                <h1>문자열</h1>
                <input
                    type="text"
                    value={characterLine}
                    onChange={(e) => setCharacterLine(e.target.value)}
                    style={{ fontSize: '24px', width: '100px' }}
                />
                <h1>고정값</h1>
                <ConstInputArea />
                <button style={{ width: '100px', height: '50px' }} onClick={clickSaveConst}>
                    고정값 저장
                </button>
                <h1>변동값</h1>
                <ChangeInputArea />

                <h1>저장된 고정 값</h1>
                <div>
                    {storedValue.map((value, idx) => (
                        <div key={idx} style={{ display: 'flex', gap: '50px', marginBottom: '10px' }}>
                            <div style={{ fontSize: '24px' }}>
                                {value.type} {value.number} {value.nameType} {value.voiceType} {value.voiceValue}
                            </div>
                            <button onClick={() => handleDelete(idx)} style={{ width: '100px' }}>
                                삭제
                            </button>
                        </div>
                    ))}
                </div>
                <h1>저장된 변동 값</h1>
                <div>
                    {changableValue.map((value, idx) => (
                        <div key={idx} style={{ display: 'flex', gap: '50px', marginBottom: '10px' }}>
                            <div style={{ fontSize: '24px' }}>
                                {/* {value.type} {value.number} {value.nameType} {value.voiceType} {value.voiceValue} */}
                                {value.type} {value.number}
                            </div>
                            <button onClick={() => deleteChangableValue(idx)} style={{ width: '100px' }}>
                                삭제
                            </button>
                        </div>
                    ))}
                </div>

                <button style={{ margin: '10px 20px 10px 0px', fontSize: '24px', width: '100px' }} onClick={handleGenerate}>
                    생성
                </button>
                <h1>생성된 문자열</h1>
                <div style={{ fontSize: '30px' }}>
                    캐릭터라인 :: <div>{generatedCharacterLine}</div>
                    <br />
                    보이스라인 :: <div>{generatedVoiceLine}</div>
                </div>
            </main>
        </div>
    );
}

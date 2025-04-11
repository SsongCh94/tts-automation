'use client';

import styles from './page.module.css';
import React from 'react';
import ConstInputArea from '@/components/ConstInputArea';
import ChangeInputArea from '@/components/ChangeInputArea';
import { useValueStore } from '@/store/ValueStore';
import { NameType, VoiceType } from '@/configs/NameType';

interface UsedCombinations {
    nameTypes: Record<string, number>;
    voiceTypes: Record<string, number>;
    voiceValues: Record<string, number>;
}

export default function Home() {
    const [characterLine, setCharacterLine] = React.useState<string>('R3');
    const [excelInput, setExcelInput] = React.useState<string>('');
    const [convertedInput, setConvertedInput] = React.useState<string[]>([]);

    const [generatedCharacterLine, setGeneratedCharacterLine] = React.useState<string>('');
    const [generatedVoiceLine, setGeneratedVoiceLine] = React.useState<string>('');

    const { storedValue, deleteStoredValue, changableValue, deleteChangableValue } = useValueStore();

    const handleExcelInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const input = e.target.value;
        setExcelInput(input);

        // 줄바꿈으로 분리하고 빈 줄 제거
        const lines = input.split('\n').filter((line) => line.trim());

        console.log('<ssong> lines   ::', lines);

        // 각 줄을 totalCharacter 형식으로 변환
        // const converted = lines.map((line) => {
        //     // 쉼표로 구분된 경우 첫 번째 값만 사용
        //     const firstValue = line.split(',')[0].trim();
        //     return `${firstValue}`;
        // });

        // setConvertedInput(converted);
        setConvertedInput(lines);
    };

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
        const uniqueCharacters = Array.from(new Set(convertedInput));

        console.log('<ssong> uniqueCharacters   ::', uniqueCharacters);
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

        // Set 대신 객체로 변경
        const usedCombinations: UsedCombinations = {
            nameTypes: {}, // nameType별 사용 횟수
            voiceTypes: {}, // nameType-voiceType별 사용 횟수
            voiceValues: {}, // nameType-voiceType-voiceValue별 사용 횟수
        };

        // 기존 storedValue의 조합을 먼저 추가
        storedValue.forEach((item) => {
            // uniqueCharacters에 포함되는 캐릭터만 처리
            const isIncluded = uniqueCharacters.some((char) => {
                // char에서 type과 number 추출
                const match = char.match(/([가-힣]+)(\d+)/);
                if (!match) {
                    console.log('<ssong> 등장하지 않는 인물   ::', char);
                    return false;
                }
                console.log('<ssong> 등장하는 인물   ::', char);
                const [, type, number] = match;
                return item.type === type && item.number === parseInt(number);
            });

            if (!isIncluded) return;

            const nameType = item.nameType;
            const voiceType = item.voiceType;
            const voiceValue = item.voiceValue;

            // nameType 카운트
            usedCombinations.nameTypes[nameType] = (usedCombinations.nameTypes[nameType] || 0) + 1;

            // voiceType 카운트
            const voiceTypeKey = `${nameType}-${voiceType}`;
            usedCombinations.voiceTypes[voiceTypeKey] = (usedCombinations.voiceTypes[voiceTypeKey] || 0) + 1;

            // voiceValue 카운트
            const voiceValueKey = `${nameType}-${voiceType}-${voiceValue}`;
            usedCombinations.voiceValues[voiceValueKey] = (usedCombinations.voiceValues[voiceValueKey] || 0) + 1;
        });

        // 모든 캐릭터 정보 생성
        const processedCharacters = characterDetails.reduce((acc: any, detail) => {
            console.log('<ssong> usedCombinations   ::', usedCombinations);
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
                const nameType = existingInStored.nameType;
                const voiceType = existingInStored.voiceType;
                const voiceValue = existingInStored.voiceValue;

                // nameType 카운트
                usedCombinations.nameTypes[nameType] = (usedCombinations.nameTypes[nameType] || 0) + 1;

                // voiceType 카운트
                const voiceTypeKey = `${nameType}-${voiceType}`;
                usedCombinations.voiceTypes[voiceTypeKey] = (usedCombinations.voiceTypes[voiceTypeKey] || 0) + 1;

                // voiceValue 카운트
                const voiceValueKey = `${nameType}-${voiceType}-${voiceValue}`;
                usedCombinations.voiceValues[voiceValueKey] = (usedCombinations.voiceValues[voiceValueKey] || 0) + 1;
                return acc;
            } else if (existingInChangable) {
                // changableValue에 있으면, 해당 타입과 번호를 사용하여 새로운 캐릭터 생성
                const baseType = detail?.type;

                // 변동값에 지정된 타입(할아버지 등)을 고려하여 nameType 선택
                const voiceTypeForSelection = existingInChangable.type; // 할아버지, 여자아이 등
                const availableNames = Object.keys(NameType).filter((name) => NameType[name].sex.includes(voiceTypeForSelection));
                // 가장 적게 사용된 nameType 찾기
                const leastUsedNameType = availableNames.reduce((least, current) => {
                    const leastCount = usedCombinations.nameTypes[least] || 0;
                    const currentCount = usedCombinations.nameTypes[current] || 0;

                    if (leastCount === currentCount) {
                        return Math.random() < 0.5 ? current : least;
                    }
                    return currentCount < leastCount ? current : least;
                }, availableNames[0]);

                // voiceType 선택 - 이미 사용된 nameType에 대해 중복되지 않는 voiceType 선택
                const availableVoiceTypes = Object.keys(NameType[leastUsedNameType].voiceType);
                const leastUsedVoiceType = availableVoiceTypes.reduce((least, current) => {
                    const leastKey = `${leastUsedNameType}-${least}`;
                    const currentKey = `${leastUsedNameType}-${current}`;

                    const leastCount = usedCombinations.voiceTypes[leastKey] || 0;
                    const currentCount = usedCombinations.voiceTypes[currentKey] || 0;

                    if (leastCount === currentCount) {
                        return Math.random() < 0.5 ? current : least;
                    }
                    return currentCount < leastCount ? current : least;
                }, availableVoiceTypes[0]);

                // voiceValue 선택 - 가장 적게 사용된 조합 찾기
                const availableVoiceValues = NameType[leastUsedNameType].voiceType[leastUsedVoiceType as VoiceType] || [];
                const leastUsedVoiceValue = availableVoiceValues.reduce((least, current) => {
                    const leastKey = `${leastUsedNameType}-${leastUsedVoiceType}-${least}`;
                    const currentKey = `${leastUsedNameType}-${leastUsedVoiceType}-${current}`;

                    const leastCount = usedCombinations.voiceValues[leastKey] || 0;
                    const currentCount = usedCombinations.voiceValues[currentKey] || 0;

                    if (leastCount === currentCount) {
                        return Math.random() < 0.5 ? current : least;
                    }
                    return currentCount < leastCount ? current : least;
                }, availableVoiceValues[0]);

                // 사용된 조합 추가
                const nameTypeKey = leastUsedNameType;
                const voiceTypeKey = `${leastUsedNameType}-${leastUsedVoiceType}`;
                const voiceValueKey = `${leastUsedNameType}-${leastUsedVoiceType}-${leastUsedVoiceValue}`;

                usedCombinations.nameTypes[nameTypeKey] = (usedCombinations.nameTypes[nameTypeKey] || 0) + 1;
                usedCombinations.voiceTypes[voiceTypeKey] = (usedCombinations.voiceTypes[voiceTypeKey] || 0) + 1;
                usedCombinations.voiceValues[voiceValueKey] = (usedCombinations.voiceValues[voiceValueKey] || 0) + 1;

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
                const leastUsedNameType = availableNames.reduce((least, current) => {
                    const leastCount = usedCombinations.nameTypes[least] || 0;
                    const currentCount = usedCombinations.nameTypes[current] || 0;

                    if (leastCount === currentCount) {
                        return Math.random() < 0.5 ? current : least;
                    }
                    return currentCount < leastCount ? current : least;
                }, availableNames[0]);
                // voiceType 선택 - 가장 적게 사용된 voiceType 찾기
                const availableVoiceTypes = Object.keys(NameType[leastUsedNameType ?? baseType].voiceType);
                const leastUsedVoiceType = availableVoiceTypes.reduce((least, current) => {
                    const leastKey = `${leastUsedNameType}-${least}`;
                    const currentKey = `${leastUsedNameType}-${current}`;

                    const leastCount = usedCombinations.voiceTypes[leastKey] || 0;
                    const currentCount = usedCombinations.voiceTypes[currentKey] || 0;

                    if (leastCount === currentCount) {
                        return Math.random() < 0.5 ? current : least;
                    }
                    return currentCount < leastCount ? current : least;
                }, availableVoiceTypes[0]);

                // voiceValue 선택 - 가장 적게 사용된 조합 찾기
                const availableVoiceValues = NameType[leastUsedNameType].voiceType[leastUsedVoiceType as VoiceType] || [];
                const leastUsedVoiceValue = availableVoiceValues.reduce((least, current) => {
                    const leastKey = `${leastUsedNameType}-${leastUsedVoiceType}-${least}`;
                    const currentKey = `${leastUsedNameType}-${leastUsedVoiceType}-${current}`;

                    const leastCount = usedCombinations.voiceValues[leastKey] || 0;
                    const currentCount = usedCombinations.voiceValues[currentKey] || 0;

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
                const nameTypeKey = leastUsedNameType;
                const voiceTypeKey = `${leastUsedNameType}-${leastUsedVoiceType}`;
                const voiceValueKey = `${leastUsedNameType}-${leastUsedVoiceType}-${leastUsedVoiceValue}`;

                usedCombinations.nameTypes[nameTypeKey] = (usedCombinations.nameTypes[nameTypeKey] || 0) + 1;
                usedCombinations.voiceTypes[voiceTypeKey] = (usedCombinations.voiceTypes[voiceTypeKey] || 0) + 1;
                usedCombinations.voiceValues[voiceValueKey] = (usedCombinations.voiceValues[voiceValueKey] || 0) + 1;

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
                if (curr?.originalText) {
                    console.log('<ssong> originalText   ::', curr?.originalText);
                    console.log('<ssong> curr   ::', curr);
                }
                // 원본 문자열이 있으면 사용, 없으면 type+number 사용
                const characterKey = curr?.originalText || `${curr?.type}${curr?.number}`;

                acc += `${characterLine}="${characterKey}", "${type === 'character' ? curr?.nameType : `${curr?.voiceType}-${curr?.voiceValue}`}"${
                    idx === processedCharacters.length - 1 ? '' : ', '
                }`;
                return acc;
            }, '');
        };

        if (getResult('character').includes('기타')) {
            alert('기타 캐릭터가 있습니다.');
        }

        setGeneratedCharacterLine(`=(IFERROR(IFS(${getResult('character')}),"기타")`);
        setGeneratedVoiceLine(`=(IFERROR(IFS(${getResult('voice')}),"기타")`);
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
                    <h1>엑셀입력</h1>
                    <textarea
                        value={excelInput}
                        onChange={handleExcelInputChange}
                        style={{ width: '100%', height: '200px', marginBottom: '20px' }}
                        placeholder="엑셀에서 복사한 텍스트를 붙여넣으세요"
                    />
                </div>
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
                <div style={{ display: 'flex', flexWrap: 'wrap' }}>
                    {changableValue.map((value, idx) => (
                        <div key={idx} style={{ display: 'flex', gap: '10px', margin: '0 30px 10px 0px' }}>
                            <div style={{ fontSize: '24px', width: '150px' }}>
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
                    <div>
                        캐릭터라인 :: <div>{generatedCharacterLine}</div>
                        <CopyButton text={generatedCharacterLine} />
                    </div>
                    <br />
                    <div>
                        보이스라인 :: <div>{generatedVoiceLine}</div>
                        <CopyButton text={generatedVoiceLine} />
                    </div>
                </div>
            </main>
        </div>
    );
}

const CopyButton = ({ text }: { text: string }) => {
    // 복사 기능
    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
    };

    return (
        <button
            onClick={() => copyToClipboard(text)}
            style={{
                padding: '5px 10px',
                fontSize: '16px',
                cursor: 'pointer',
                backgroundColor: '#4CAF50',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
            }}
        >
            복사
        </button>
    );
};

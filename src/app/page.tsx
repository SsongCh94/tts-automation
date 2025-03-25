'use client';

import styles from './page.module.css';
import React from 'react';
import ConstInputArea from '@/components/ConstInputArea';
import ChangeInputArea from '@/components/ChangeInputArea';
import { useValueStore } from '@/store/ValueStore';

export default function Home() {
    const [characterLine, setCharacterLine] = React.useState<string>('');

    const [generatedCharacterLine, setGeneratedCharacterLine] = React.useState<string>('');
    const [generatedVoiceLine, setGeneratedVoiceLine] = React.useState<string>('');

    const { storedValue, deleteStoredValue, changableValue, deleteChangableValue } = useValueStore();

    const handleGenerate = () => {
        console.log('<ssong> storedValue   ::', storedValue);
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

        const getResult = (type: 'character' | 'voice') => {
            return storedValue.reduce((acc, curr, idx) => {
                acc += `${characterLine}="${curr.type}${curr.number}", "${
                    type === 'character' ? curr.nameType : `${curr.voiceType}-${curr.voiceValue}`
                }"${idx === storedValue.length - 1 ? '' : ', '}`;
                return acc;
            }, '');
        };
        console.log('<ssong> characterLine   ::', `=ARRAY_CONSTRAIN(ARRAYFORMULA(IFERROR(IFS(${getResult('character')}),"기타")), 1, 1)`);
        console.log('<ssong> voiceLine   ::', `=ARRAY_CONSTRAIN(ARRAYFORMULA(IFERROR(IFS(${getResult('voice')}),"기타")), 1, 1)`);
        setGeneratedCharacterLine(`=ARRAY_CONSTRAIN(ARRAYFORMULA(IFERROR(IFS(${getResult('character')}),"기타")), 1, 1)`);
        setGeneratedVoiceLine(`=ARRAY_CONSTRAIN(ARRAYFORMULA(IFERROR(IFS(${getResult('voice')}),"기타")), 1, 1)`);
    };

    const handleDelete = (idx: number) => {
        deleteStoredValue(idx);
    };

    const clickSaveConst = () => {
        console.log('<ssong> storedValue   ::', storedValue);
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
                                {value.type} {value.number} {value.nameType} {value.voiceType} {value.voiceValue}
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

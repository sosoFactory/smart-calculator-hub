import React from 'react';
import { InfoCard } from '../../../components/common/InfoCard';

export const DevToolsInfoCard: React.FC = () => {
  return (
    <InfoCard
      title="개발자 상식 & 실무 가이드 (Dev Guide)"
      items={[
        {
          term: '진법 체계와 컴퓨터 데이터',
          desc: '컴퓨터는 0과 1로 표현되는 2진수(0b)를 기본으로 동작합니다. 16진수(0x)는 4개의 비트(1 Nibble)를 문자 1개로 압축 표기할 수 있어 메모리 주소나 색상 코드에 널리 사용됩니다.',
        },
        {
          term: 'CSS rem과 em의 차이점',
          desc: 'rem은 최상위 HTML 루트 태그(기본 16px)의 폰트 크기만을 기준으로 삼아 중첩에 의한 크기 왜곡이 없습니다. em은 직계 부모 요소의 폰트 크기에 비례합니다.',
        },
        {
          term: 'RGB와 HSL & WCAG 명암비',
          desc: 'RGB는 빛의 3원색 가산 혼합 모델이며, HSL은 색상(0~360°), 채도(%), 명도(%)로 인간의 직관에 가장 가깝습니다. 웹 접근성(WCAG AA)은 본문 텍스트 기준 4.5:1 이상의 명암 대비를 권장합니다.',
        },
      ]}
      notice="본 도구의 모든 진법 및 단위 변환 연산은 외부 서버 통신 없이 100% 브라우저 클라이언트에서 실시간으로 처리되며, 데이터가 외부에 수집되지 않습니다."
    />
  );
};

import React from 'react';
import { InfoCard } from '../../../components/common/InfoCard';

export const CompoundInfoCard: React.FC = () => {
  return (
    <InfoCard
      title="복리 투자 상식 및 유의사항 안내"
      items={[
        {
          term: '72의 법칙',
          desc: (
            <>
              원금이 2배가 되는 시간 ≈ <strong>72 ÷ 연수익률(%)</strong> (예: 연 7% 복리 시 약 10년)
            </>
          ),
        },
        {
          term: '복리의 마법',
          desc: '발생한 이자에도 다시 이자가 붙어 투자 기간이 길수록 자산이 기하급수적으로 증가합니다.',
        },
        {
          term: '절세 계좌 활용',
          desc: '일반과세(15.4%) 대신 ISA(9.9% 분리과세) 등 절세 계좌를 활용하면 세금 이연으로 복리 효과가 극대화됩니다.',
        },
        {
          term: '금융소득 종합과세',
          desc: (
            <>
              연간 이자·배당소득 합계가 <strong>2,000만 원</strong>을 초과하면 종합과세 합산 대상이 됩니다.
            </>
          ),
        },
      ]}
      notice="본 결과는 고정 수익률과 복리 주기를 가정한 단순 시뮬레이션 모델이며, 실제 투자 시 원금 손실 위험 및 물가상승률(인플레이션)에 따른 실질 가치 변동이 있을 수 있습니다."
    />
  );
};

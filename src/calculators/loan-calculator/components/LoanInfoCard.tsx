import React from 'react';
import { InfoCard } from '../../../components/common/InfoCard';

export const LoanInfoCard: React.FC = () => {
  return (
    <InfoCard
      title="대출 상환 상식 및 유의사항 안내"
      items={[
        {
          term: '상환방식 선택 가이드',
          desc: (
            <>
              매달 일정한 지출로 자금 계획을 세우려면 <strong>원리금균등</strong>, 초기 부담이 다소 크더라도 총 대출이자를 가장 많이 아끼려면 <strong>원금균등</strong> 방식이 유리합니다.
            </>
          ),
        },
        {
          term: 'DSR / DTI / LTV 규제',
          desc: 'DSR은 모든 대출의 연간 원리금 상환액이 연소득에서 차지하는 비율(통상 은행권 40% 한도), LTV는 담보주택 가격 대비 대출 가능 비율입니다.',
        },
        {
          term: '중도상환 수수료 면제 시점',
          desc: (
            <>
              시중은행 대출은 통상 <strong>대출 실행일로부터 3년(36개월)</strong>이 지나면 중도상환 수수료가 전액 면제됩니다. (3년 이내에는 경과일수 비례 차감)
            </>
          ),
        },
        {
          term: '금리인하요구권',
          desc: '취업, 승진, 소득 증가, 신용점수 상승 등 신용 상태가 개선된 경우 금융회사에 대출 금리 인하를 법적으로 요구할 수 있습니다.',
        },
      ]}
      notice="본 계산기는 고정금리 및 원단위 반올림을 가정한 시뮬레이션 모델입니다. 실제 대출 시에는 은행별 일할계산 기준, 변동금리 주기, 휴일 여부에 따라 실제 월 청구액과 미세한 차이가 발생할 수 있습니다."
    />
  );
};

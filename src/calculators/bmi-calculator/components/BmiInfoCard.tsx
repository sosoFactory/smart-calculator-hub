import React from 'react';
import { InfoCard } from '../../../components/common/InfoCard';

export const BmiInfoCard: React.FC = () => {
  return (
    <InfoCard
      title="BMI 체질량지수 및 건강 관리 상식"
      items={[
        {
          term: '한국인 비만 기준 (KSSO)',
          desc: (
            <>
              서양인(WHO, BMI 30 이상)과 달리 동양인은 체지방률과 내장지방 축적이 빨라 대한비만학회는 <strong>BMI 25 이상</strong>을 1단계 비만으로 엄격히 관리합니다.
            </>
          ),
        },
        {
          term: 'BMI의 한계점과 체지방률',
          desc: '신장과 체중만으로 산출되어 골격근량과 지방량을 구분하지 못하므로, 근육량이 많은 운동인은 인바디 등 체성분 분석을 함께 참고해야 합니다.',
        },
        {
          term: '복부비만 허리둘레 기준',
          desc: (
            <>
              한국 성인 기준 허리둘레가 <strong>남성 90cm(약 35.4인치)</strong>, <strong>여성 85cm(약 33.5인치)</strong> 이상이면 대사증후군 위험이 높은 복부비만으로 진단됩니다.
            </>
          ),
        },
        {
          term: '건강한 체중 감량 속도',
          desc: '급격한 단식은 근손실과 요요를 유발하므로, 한 달에 1 ~ 2kg 내외로 서서히 체중을 감량하는 것이 장기적인 건강과 기초대사량 유지에 가장 이상적입니다.',
        },
      ]}
      notice="본 BMI 계산 결과는 대한비만학회 표준 임상 기준을 참고한 1차 건강 스크리닝 지표입니다. 개인의 골격근량, 부종, 체지방률에 따라 전문 의료진 또는 정밀 체성분 검사와 상담하시기 바랍니다."
    />
  );
};

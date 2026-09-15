import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  CALCULATORS_LIST,
  CalculatorItem,
  CATEGORY_NAMES,
} from '../types/navigation';
import {
  TrendingUp,
  Ruler,
  ArrowLeftRight,
  Landmark,
  Calendar,
  Target,
  Calculator,
  Wallet,
  ArrowRight,
  Activity,
  Copy,
  Check,
  QrCode,
} from 'lucide-react';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { useToast } from '../hooks/use-toast';
import { siteConfig } from '../config/site';

export const HomeApp: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [copied, setCopied] = useState<boolean>(false);

  const handleCopyUrl = async () => {
    const url = siteConfig.url;
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(url);
      } else {
        const textArea = document.createElement('textarea');
        textArea.value = url;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
      }
      setCopied(true);
      toast({
        title: '사이트 주소가 복사되었습니다',
        description: '원하는 곳에 붙여넣어 스마트 계산기를 공유해보세요.',
      });
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast({
        title: '주소 복사 실패',
        description: '브라우저 주소창의 URL을 직접 복사해주세요.',
        variant: 'destructive',
      });
    }
  };

  // 아이콘 렌더링 헬퍼
  const renderIcon = (id: string) => {
    const iconCls = 'w-4 h-4 sm:w-5 sm:h-5 transition-transform duration-200 group-hover:scale-110';
    switch (id) {
      case 'compound':
        return <TrendingUp className={`${iconCls} text-emerald-500 dark:text-[#d1ff19]`} />;
      case 'loan':
        return <Landmark className={`${iconCls} text-sky-500 dark:text-sky-400`} />;
      case 'salary':
        return <Wallet className={`${iconCls} text-indigo-500 dark:text-indigo-400`} />;
      case 'unit':
        return <Ruler className={`${iconCls} text-amber-500 dark:text-amber-400`} />;
      case 'bmi':
        return <Activity className={`${iconCls} text-rose-500 dark:text-rose-400`} />;
      case 'exchange':
        return <ArrowLeftRight className={`${iconCls} text-teal-500 dark:text-teal-400`} />;
      case 'dividend':
        return <Calendar className={`${iconCls} text-slate-400`} />;
      case 'goal':
        return <Target className={`${iconCls} text-slate-400`} />;
      default:
        return <Calculator className={`${iconCls} text-slate-400`} />;
    }
  };

  // 카테고리 필터링
  const filteredCalculators = useMemo(() => {
    if (selectedCategory === 'all') return CALCULATORS_LIST;
    return CALCULATORS_LIST.filter((calc) => calc.category === selectedCategory);
  }, [selectedCategory]);

  const categories: { key: string; label: string }[] = [
    { key: 'all', label: '전체' },
    { key: 'finance', label: '금융 & 자산' },
    { key: 'lifestyle', label: '생활 & 측정' },
    { key: 'global', label: '통화 & 글로벌' },
  ];

  return (
    <div className="w-full pb-8 sm:pb-12 space-y-4 sm:space-y-6">
      {/* 1. 카테고리 퀵 탭 칩 섹션 (본문 타이틀 완전 배제 및 상단 고정 헤더 일원화) */}
      <section className="pt-0.5 sm:pt-1">
        <div className="flex items-center justify-start flex-wrap gap-1.5">
          {categories.map((cat) => {
            const isSelected = selectedCategory === cat.key;
              return (
                <Button
                  key={cat.key}
                  type="button"
                  variant={isSelected ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedCategory(cat.key)}
                  className={`h-7 sm:h-8 px-2.5 sm:px-3 text-[11px] sm:text-xs rounded-full font-medium transition-all ${
                    isSelected
                      ? 'bg-[#15171a] dark:bg-[#d1ff19] text-white dark:text-[#112220] hover:bg-[#1e2329] dark:hover:bg-[#c2ed17] shadow-sm'
                      : 'bg-white dark:bg-[#15171a] border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  {cat.label}
                </Button>
              );
            })}
        </div>
      </section>

      {/* 2. 모바일 2열 콤팩트 카드 그리드 (스크롤 최소화 핏) */}
      <section>
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 sm:gap-3.5">
          {filteredCalculators.map((item: CalculatorItem) => {
            const isComingSoon = item.status === 'coming-soon';

            return (
              <div
                key={item.id}
                onClick={() => navigate(`/${item.id}`)}
                className={`group relative flex flex-col justify-between p-3 sm:p-4 rounded-xl sm:rounded-2xl border transition-all duration-200 cursor-pointer text-left ${
                  isComingSoon
                    ? 'bg-slate-50/60 dark:bg-[#13171f]/40 border-slate-200/70 dark:border-slate-800/50 opacity-75 hover:opacity-100'
                    : 'bg-white dark:bg-[#15171a] border-slate-200 dark:border-slate-800 hover:border-slate-400 dark:hover:border-[#d1ff19]/60 hover:shadow-sm dark:hover:shadow-[0_4px_16px_rgba(209,255,25,0.05)]'
                }`}
              >
                <div className="space-y-2 sm:space-y-2.5">
                  {/* 상단: 아이콘 + 뱃지 */}
                  <div className="flex items-center justify-between">
                    <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg sm:rounded-xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700 flex items-center justify-center shrink-0">
                      {renderIcon(item.id)}
                    </div>

                    {isComingSoon ? (
                      <Badge
                        variant="outline"
                        className="text-[10px] sm:text-[11px] px-1.5 py-0 font-medium bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500 border-slate-200 dark:border-slate-700"
                      >
                        출시예정
                      </Badge>
                    ) : (
                      <span className="text-[10px] font-medium text-slate-400 dark:text-slate-500 truncate max-w-[80px] sm:max-w-none text-right">
                        {CATEGORY_NAMES[item.category].split(' ')[0]}
                      </span>
                    )}
                  </div>

                  {/* 중단: 타이틀 및 간결한 설명 */}
                  <div>
                    <h3 className="text-[13px] sm:text-base font-bold text-[#112220] dark:text-slate-100 tracking-tight leading-snug group-hover:text-black dark:group-hover:text-white transition-colors line-clamp-1">
                      {item.shortName}
                    </h3>
                    <p className="text-[11px] sm:text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-2 leading-tight sm:leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                </div>

                {/* 하단: 미니 액션 라인 */}
                <div className="pt-2.5 sm:pt-3 mt-1.5 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-[11px] sm:text-xs font-semibold">
                  <span
                    className={
                      isComingSoon
                        ? 'text-slate-400 dark:text-slate-500'
                        : 'text-[#112220] dark:text-[#d1ff19] group-hover:underline'
                    }
                  >
                    {isComingSoon ? '안내' : '시작'}
                  </span>
                  <ArrowRight
                    className={`w-3 h-3 sm:w-3.5 sm:h-3.5 transition-transform duration-200 group-hover:translate-x-0.5 ${
                      isComingSoon ? 'text-slate-400' : 'text-[#112220] dark:text-[#d1ff19]'
                    }`}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 3. 모바일 접속 QR 코드 및 URL 복사 카드 (PRD 2.6 명세 준수) */}
      <section className="pt-2 sm:pt-4">
        <div className="bg-white dark:bg-[#15171a] border border-slate-200 dark:border-slate-800 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-center gap-4 sm:gap-5 transition-colors shadow-sm">
          {/* QR 코드 이미지 (고대비 화이트 라운드 패딩 백그라운드) */}
          <div className="shrink-0 p-2 bg-white rounded-xl border border-slate-200 shadow-xs flex items-center justify-center">
            <img
              src="/site-qr.svg"
              alt="스마트 계산기 허브 모바일 접속 QR 코드"
              className="w-20 h-20 sm:w-[88px] sm:h-[88px] object-contain"
              loading="lazy"
              width={88}
              height={88}
            />
          </div>

          {/* 안내 텍스트 및 액션 버튼 */}
          <div className="flex-1 min-w-0 text-center sm:text-left space-y-2.5">
            <div>
              <div className="flex items-center justify-center sm:justify-start gap-1.5 mb-1">
                <QrCode className="w-4 h-4 text-[#112220] dark:text-[#d1ff19]" />
                <h3 className="text-sm sm:text-base font-bold text-[#112220] dark:text-slate-100 tracking-tight">
                  모바일로 바로 열기
                </h3>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed max-w-xl">
                스마트폰 카메라로 QR 코드를 스캔하여 바로 접속하거나, 홈 화면에 추가하여 앱처럼 사용해보세요.
              </p>
            </div>

            <div className="flex items-center justify-center sm:justify-start gap-2 pt-0.5">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleCopyUrl}
                aria-label="사이트 주소 복사"
                className="h-8 px-3 gap-1.5 text-xs font-semibold rounded-lg bg-slate-50 dark:bg-slate-800/80 border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-[#112220] dark:text-slate-100 transition-colors"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-500" />
                    <span>복사 완료!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>URL 복사</span>
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomeApp;

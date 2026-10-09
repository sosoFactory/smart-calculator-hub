import React, { useState, useMemo } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  CALCULATORS_LIST,
  CalculatorItem,
  CATEGORY_NAMES,
  compareCalculatorsKorean,
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
  Coins,
  CalendarDays,
  Flame,
  Star,
  CodeXml,
  PiggyBank,
} from 'lucide-react';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Tooltip, TooltipTrigger, TooltipContent } from '../components/ui/tooltip';
import { useToast } from '../hooks/use-toast';
import { siteConfig } from '../config/site';
import { useFavorites } from '../hooks/useFavorites';

export const HomeApp: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [copied, setCopied] = useState<boolean>(false);
  const { favorites, isFavorite, toggleFavorite } = useFavorites();

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

  // 아이콘 렌더링 헬퍼 (Ghost 디자인 시스템: 차분하고 일관된 에디토리얼 모노크롬 아이콘 적용)
  const renderIcon = (id: string) => {
    const iconCls = 'w-4 h-4 sm:w-5 sm:h-5 text-ghost-ink-soft dark:text-ghost-dark-ink-soft group-hover:text-ghost-ink dark:group-hover:text-ghost-dark-ink transition-all duration-200 group-hover:scale-110';
    switch (id) {
      case 'compound':
        return <TrendingUp className={iconCls} />;
      case 'loan':
        return <Landmark className={iconCls} />;
      case 'salary':
        return <Wallet className={iconCls} />;
      case 'part-time':
        return <Coins className={iconCls} />;
      case 'unit':
        return <Ruler className={iconCls} />;
      case 'bmi':
        return <Activity className={iconCls} />;
      case 'exchange':
        return <ArrowLeftRight className={iconCls} />;
      case 'dividend':
        return <Calendar className={iconCls} />;
      case 'goal':
        return <Target className={iconCls} />;
      case 'cashflow':
        return <Flame className={iconCls} />;
      case 'date':
        return <CalendarDays className={iconCls} />;
      case 'devtools':
        return <CodeXml className={iconCls} />;
      case 'severance':
        return <PiggyBank className={iconCls} />;
      default:
        return <Calculator className={iconCls} />;
    }
  };

  // 카테고리 필터링 및 즐겨찾기 최우선(Pin-to-Top) + 가나다 다중 정렬 (미출시 제외)
  const filteredCalculators = useMemo(() => {
    const activeList = CALCULATORS_LIST.filter((calc) => calc.status !== 'coming-soon');
    const list =
      selectedCategory === 'all'
        ? activeList
        : activeList.filter((calc) => calc.category === selectedCategory);

    return [...list].sort((a, b) => {
      const aFav = favorites.includes(a.id);
      const bFav = favorites.includes(b.id);
      if (aFav && !bFav) return -1;
      if (!aFav && bFav) return 1;
      return compareCalculatorsKorean(a, b);
    });
  }, [selectedCategory, favorites]);

  const categories = [
    { key: 'all', label: '전체' },
    { key: 'finance', label: '금융 & 자산' },
    { key: 'lifestyle', label: '생활 & 측정' },
    { key: 'global', label: '통화 & 글로벌' },
  ];

  const renderCalculatorCard = (item: CalculatorItem) => {
    const isComingSoon = item.status === 'coming-soon';
    const isFav = isFavorite(item.id);

    return (
      <Link
        key={item.id}
        to={`/${item.id}`}
        onClick={() => navigate(`/${item.id}`)}
        className={`group relative flex flex-col justify-between p-3 sm:p-4 rounded-xl sm:rounded-2xl border transition-all duration-200 cursor-pointer text-left no-underline ${
          isComingSoon
            ? 'bg-ghost-surface-deep/60 dark:bg-ghost-dark-canvas/60 border-ghost-hairline/70 dark:border-ghost-dark-hairline opacity-75 hover:opacity-100'
            : 'bg-white dark:bg-ghost-dark-surface border-ghost-hairline dark:border-ghost-dark-hairline hover:border-ghost-hairline-soft dark:hover:border-ghost-dark-hairline-dark hover:shadow-sm'
        }`}
      >
        <div className="space-y-2 sm:space-y-2.5">
          {/* 상단: 아이콘 + 뱃지 및 즐겨찾기 별 버튼 */}
          <div className="flex items-center justify-between">
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg sm:rounded-xl bg-ghost-surface-deep dark:bg-ghost-dark-surface-elevated border border-ghost-hairline dark:border-ghost-dark-hairline-soft flex items-center justify-center shrink-0">
              {renderIcon(item.id)}
            </div>

            <div className="flex items-center gap-1.5 min-w-0">
              {isComingSoon ? (
                <Badge
                  variant="outline"
                  className="text-[10px] sm:text-[11px] px-1.5 py-0 font-medium bg-ghost-surface-deep dark:bg-ghost-dark-surface-elevated text-ghost-ink-stone dark:text-ghost-dark-ink-stone border-ghost-hairline dark:border-ghost-dark-hairline-soft"
                >
                  출시예정
                </Badge>
              ) : (
                <>
                  <span className="text-[10px] font-medium text-ghost-ink-stone dark:text-ghost-dark-ink-stone truncate max-w-[65px] sm:max-w-none text-right">
                    {CATEGORY_NAMES[item.category].split(' ')[0]}
                  </span>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          toggleFavorite(item.id);
                        }}
                        className="p-1 -mr-1 rounded-md text-ghost-ink dark:text-ghost-dark-ink transition-transform active:scale-90"
                        aria-label={isFav ? `${item.shortName} 즐겨찾기 해제` : `${item.shortName} 즐겨찾기 추가`}
                      >
                        <Star
                          className={`w-3.5 h-3.5 sm:w-4 sm:h-4 text-ghost-ink dark:text-ghost-dark-ink transition-colors ${
                            isFav ? 'fill-current' : 'fill-none'
                          }`}
                        />
                      </button>
                    </TooltipTrigger>
                    <TooltipContent side="top">
                      {isFav ? '즐겨찾기 해제' : '즐겨찾기 추가'}
                    </TooltipContent>
                  </Tooltip>
                </>
              )}
            </div>
          </div>

          {/* 중단: 타이틀 및 간결한 설명 */}
          <div>
            <h3 className="text-[13px] sm:text-base font-bold text-ghost-ink dark:text-ghost-dark-ink tracking-tight leading-snug group-hover:text-black dark:group-hover:text-white transition-colors line-clamp-1">
              {item.shortName}
            </h3>
            <p className="text-[11px] sm:text-xs text-ghost-ink-mute dark:text-ghost-dark-ink-mute mt-1 line-clamp-2 leading-tight sm:leading-relaxed">
              {item.description}
            </p>
          </div>
        </div>

        {/* 하단: 미니 액션 라인 */}
        <div className="pt-2.5 sm:pt-3 mt-1.5 border-t border-ghost-hairline/60 dark:border-ghost-dark-hairline flex items-center justify-between text-[11px] sm:text-xs font-semibold">
          <span
            className={
              isComingSoon
                ? 'text-ghost-ink-stone dark:text-ghost-dark-ink-stone'
                : 'text-ghost-ink dark:text-ghost-dark-ink group-hover:underline'
            }
          >
            {isComingSoon ? '안내' : '시작'}
          </span>
          <ArrowRight
            className={`w-3 h-3 sm:w-3.5 sm:h-3.5 transition-transform duration-200 group-hover:translate-x-0.5 ${
              isComingSoon
                ? 'text-ghost-ink-stone dark:text-ghost-dark-ink-stone'
                : 'text-ghost-ink dark:text-ghost-dark-ink'
            }`}
          />
        </div>
      </Link>
    );
  };

  return (
    <div className="w-full pb-8 sm:pb-12 space-y-4 sm:space-y-6">
      {/* 1. 카테고리 퀵 탭 칩 섹션 (Ghost 모노크롬 캡슐 칩 스타일 일원화) */}
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
                    ? 'bg-ghost-ink-base dark:bg-ghost-dark-surface-elevated text-white dark:text-ghost-dark-ink hover:bg-black dark:hover:bg-ghost-dark-hover shadow-sm border border-transparent dark:border-ghost-dark-hairline-soft'
                    : 'bg-white dark:bg-ghost-dark-surface-deep border-ghost-hairline dark:border-ghost-dark-hairline-soft text-ghost-ink-soft dark:text-ghost-dark-ink-mute hover:bg-ghost-hover dark:hover:bg-ghost-dark-hover'
                }`}
              >
                {cat.label}
              </Button>
            );
          })}
        </div>
      </section>

      {/* 2. 모바일 2열 콤팩트 카드 그리드 (즐겨찾기 Pin-to-Top 우선 정렬 & 스크롤 최소화 핏) */}
      <section>
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 sm:gap-3.5">
          {filteredCalculators.map((item: CalculatorItem) => renderCalculatorCard(item))}
        </div>
      </section>

      {/* 3. 모바일 접속 QR 코드 및 URL 복사 카드 (PRD 2.6 명세 준수) */}
      <section className="pt-2 sm:pt-4">
        <div className="bg-white dark:bg-ghost-dark-surface border border-ghost-hairline dark:border-ghost-dark-hairline rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-center gap-4 sm:gap-5 transition-colors shadow-sm">
          {/* QR 코드 이미지 (고대비 화이트 라운드 패딩 백그라운드) */}
          <div className="shrink-0 p-2 bg-white rounded-xl border border-ghost-hairline shadow-xs flex items-center justify-center">
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
                <QrCode className="w-4 h-4 text-ghost-ink dark:text-ghost-dark-ink" />
                <h3 className="text-sm sm:text-base font-bold text-ghost-ink dark:text-ghost-dark-ink tracking-tight">
                  모바일로 바로 열기
                </h3>
              </div>
              <p className="text-xs text-ghost-ink-mute dark:text-ghost-dark-ink-mute leading-relaxed max-w-xl">
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
                className="h-8 px-3 gap-1.5 text-xs font-semibold rounded-lg bg-ghost-surface-deep dark:bg-ghost-dark-surface-elevated border-ghost-hairline dark:border-ghost-dark-hairline-soft hover:bg-ghost-hover dark:hover:bg-ghost-dark-hover text-ghost-ink dark:text-ghost-dark-ink transition-colors"
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

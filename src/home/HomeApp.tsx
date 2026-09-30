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
} from 'lucide-react';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { useToast } from '../hooks/use-toast';
import { siteConfig } from '../config/site';
import { useFavorites } from '../hooks/useFavorites';

export const HomeApp: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [copied, setCopied] = useState<boolean>(false);
  const { favorites, isFavorite, toggleFavorite } = useFavorites();

  // 즐겨찾기된 계산기 목록 (미출시 제외 & 가나다 정렬)
  const favoriteCalculators = useMemo(() => {
    return CALCULATORS_LIST.filter(
      (calc) => favorites.includes(calc.id) && calc.status !== 'coming-soon'
    ).sort(compareCalculatorsKorean);
  }, [favorites]);

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
      case 'part-time':
        return <Coins className={`${iconCls} text-lime-500 dark:text-[#d1ff19]`} />;
      case 'unit':
        return <Ruler className={`${iconCls} text-amber-500 dark:text-amber-400`} />;
      case 'bmi':
        return <Activity className={`${iconCls} text-rose-500 dark:text-rose-400`} />;
      case 'exchange':
        return <ArrowLeftRight className={`${iconCls} text-teal-500 dark:text-teal-400`} />;
      case 'dividend':
        return <Calendar className={`${iconCls} text-slate-400`} />;
      case 'goal':
        return <Target className={`${iconCls} text-violet-500 dark:text-violet-400`} />;
      case 'cashflow':
        return <Flame className={`${iconCls} text-orange-500 dark:text-orange-400`} />;
      case 'date':
        return <CalendarDays className={`${iconCls} text-amber-500 dark:text-amber-400`} />;
      default:
        return <Calculator className={`${iconCls} text-slate-400`} />;
    }
  };

  // 카테고리 필터링 및 동적 가나다 정렬 (미출시 제외 & 즐겨찾기 지원)
  const filteredCalculators = useMemo(() => {
    const activeList = CALCULATORS_LIST.filter((calc) => calc.status !== 'coming-soon');
    if (selectedCategory === 'favorites') {
      return activeList.filter((calc) => favorites.includes(calc.id)).sort(compareCalculatorsKorean);
    }
    const list =
      selectedCategory === 'all'
        ? activeList
        : activeList.filter((calc) => calc.category === selectedCategory);

    return [...list].sort(compareCalculatorsKorean);
  }, [selectedCategory, favorites]);

  const categories: { key: string; label: string }[] = useMemo(() => [
    { key: 'all', label: '전체' },
    ...(favoriteCalculators.length > 0 ? [{ key: 'favorites', label: '⭐ 즐겨찾기' }] : []),
    { key: 'finance', label: '금융 & 자산' },
    { key: 'lifestyle', label: '생활 & 측정' },
    { key: 'global', label: '통화 & 글로벌' },
  ], [favoriteCalculators.length]);

  const renderCalculatorCard = (item: CalculatorItem, isFavSection?: boolean) => {
    const isComingSoon = item.status === 'coming-soon';
    const isFav = isFavorite(item.id);

    return (
      <Link
        key={isFavSection ? `fav-${item.id}` : item.id}
        to={`/${item.id}`}
        onClick={() => navigate(`/${item.id}`)}
        className={`group relative flex flex-col justify-between p-3 sm:p-4 rounded-xl sm:rounded-2xl border transition-all duration-200 cursor-pointer text-left no-underline ${
          isComingSoon
            ? 'bg-slate-50/60 dark:bg-[#101215]/60 border-slate-200/70 dark:border-[#1d2025] opacity-75 hover:opacity-100'
            : 'bg-white dark:bg-ghost-dark-surface border-slate-200 dark:border-ghost-dark-hairline hover:border-slate-400 dark:hover:border-[#2f353f] hover:shadow-sm'
        }`}
      >
        <div className="space-y-2 sm:space-y-2.5">
          {/* 상단: 아이콘 + 뱃지 및 즐겨찾기 별 버튼 */}
          <div className="flex items-center justify-between">
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg sm:rounded-xl bg-slate-100 dark:bg-ghost-dark-surface-elevated border border-slate-200/80 dark:border-ghost-dark-hairline-soft flex items-center justify-center shrink-0">
              {renderIcon(item.id)}
            </div>

            <div className="flex items-center gap-1.5 min-w-0">
              {isComingSoon ? (
                <Badge
                  variant="outline"
                  className="text-[10px] sm:text-[11px] px-1.5 py-0 font-medium bg-slate-100 dark:bg-ghost-dark-surface-elevated text-slate-400 dark:text-ghost-dark-ink-stone border-slate-200 dark:border-ghost-dark-hairline-soft"
                >
                  출시예정
                </Badge>
              ) : (
                <>
                  <span className="text-[10px] font-medium text-slate-400 dark:text-ghost-dark-ink-stone truncate max-w-[65px] sm:max-w-none text-right">
                    {CATEGORY_NAMES[item.category].split(' ')[0]}
                  </span>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      toggleFavorite(item.id);
                    }}
                    className="p-1 -mr-1 rounded-md text-ghost-ink-stone hover:text-ghost-ink-soft dark:text-ghost-dark-ink-stone dark:hover:text-ghost-dark-ink transition-transform active:scale-90"
                    aria-label={isFav ? `${item.shortName} 즐겨찾기 해제` : `${item.shortName} 즐겨찾기 추가`}
                    title={isFav ? `${item.shortName} 즐겨찾기 해제` : `${item.shortName} 즐겨찾기 추가`}
                  >
                    <Star
                      className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${
                        isFav
                          ? 'text-ghost-favorite fill-ghost-favorite'
                          : 'text-ghost-ink-stone dark:text-ghost-dark-ink-stone hover:text-ghost-favorite'
                      }`}
                    />
                  </button>
                </>
              )}
            </div>
          </div>

          {/* 중단: 타이틀 및 간결한 설명 */}
          <div>
            <h3 className="text-[13px] sm:text-base font-bold text-[#112220] dark:text-ghost-dark-ink tracking-tight leading-snug group-hover:text-black dark:group-hover:text-white transition-colors line-clamp-1">
              {item.shortName}
            </h3>
            <p className="text-[11px] sm:text-xs text-slate-500 dark:text-ghost-dark-ink-mute mt-1 line-clamp-2 leading-tight sm:leading-relaxed">
              {item.description}
            </p>
          </div>
        </div>

        {/* 하단: 미니 액션 라인 */}
        <div className="pt-2.5 sm:pt-3 mt-1.5 border-t border-slate-100 dark:border-ghost-dark-hairline flex items-center justify-between text-[11px] sm:text-xs font-semibold">
          <span
            className={
              isComingSoon
                ? 'text-slate-400 dark:text-ghost-dark-ink-stone'
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
      </Link>
    );
  };

  return (
    <div className="w-full pb-8 sm:pb-12 space-y-4 sm:space-y-6">
      {/* 0. 즐겨찾기 등록 항목이 있을 때: 최상단 자주 쓰는 계산기 퀵 섹션 (다른 카드보다 상단에 우선 출력) */}
      {favoriteCalculators.length > 0 && selectedCategory === 'all' && (
        <section className="space-y-2.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 sm:gap-2">
              <Star className="w-4 h-4 text-ghost-favorite fill-ghost-favorite" />
              <h2 className="text-sm sm:text-base font-bold text-[#112220] dark:text-ghost-dark-ink tracking-tight">
                자주 쓰는 계산기
              </h2>
              <span className="text-[10px] sm:text-[11px] px-2 py-0.5 rounded-full bg-ghost-lime/20 text-ghost-ink dark:text-ghost-lime font-bold tabular-nums">
                {favoriteCalculators.length}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 sm:gap-3.5">
            {favoriteCalculators.map((item) => renderCalculatorCard(item, true))}
          </div>
        </section>
      )}

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
                    : 'bg-white dark:bg-ghost-dark-surface-deep border-slate-200 dark:border-ghost-dark-hairline-soft text-slate-600 dark:text-ghost-dark-ink-mute hover:bg-slate-100 dark:hover:bg-ghost-dark-hover'
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
          {filteredCalculators.map((item: CalculatorItem) => renderCalculatorCard(item, false))}
        </div>
      </section>

      {/* 3. 모바일 접속 QR 코드 및 URL 복사 카드 (PRD 2.6 명세 준수) */}
      <section className="pt-2 sm:pt-4">
        <div className="bg-white dark:bg-ghost-dark-surface border border-slate-200 dark:border-ghost-dark-hairline rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-center gap-4 sm:gap-5 transition-colors shadow-sm">
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
                <h3 className="text-sm sm:text-base font-bold text-[#112220] dark:text-ghost-dark-ink tracking-tight">
                  모바일로 바로 열기
                </h3>
              </div>
              <p className="text-xs text-slate-500 dark:text-ghost-dark-ink-mute leading-relaxed max-w-xl">
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
                className="h-8 px-3 gap-1.5 text-xs font-semibold rounded-lg bg-slate-50 dark:bg-ghost-dark-surface-elevated border-slate-200 dark:border-ghost-dark-hairline-soft hover:bg-slate-100 dark:hover:bg-dark-border text-[#112220] dark:text-ghost-dark-ink transition-colors"
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

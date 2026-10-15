import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  UtensilsCrossed,
  ShoppingBag,
  Clock,
  IndianRupee,
  QrCode,
  CheckCircle2,
  Plus,
  Minus,
  MapPin,
  User,
  Building2,
  Send,
  ChefHat,
  Flame,
  Star,
  BellRing,
  Smartphone,
  ShieldCheck,
  Truck,
  LayoutGrid,
  Store,
  Coffee,
  Soup,
} from 'lucide-react';
import { useCampus } from '../../context/CampusContext';
import {
  CanteenCategory,
  CanteenName,
  CanteenOrder,
  CanteenOrderItem,
} from '../../types/campus';

interface CanteenProfileInfo {
  id: CanteenName;
  numberLabel: string;
  title: string;
  tagline: string;
  location: string;
  avgPrep: string;
  upiId: string;
}

const CANTEENS_LIST: CanteenProfileInfo[] = [
  {
    id: 'MOJO Cafe',
    numberLabel: 'CANTEEN 01',
    title: '1. MOJO Cafe',
    tagline: 'Artisan Paninis, Crispy Wraps, Mini Pizzas & Cold Brews',
    location: 'Block 29 • Snacks & Cafe Plaza',
    avgPrep: '6–11 mins',
    upiId: 'mojocafe.vistas@okaxis',
  },
  {
    id: 'JEVAN',
    numberLabel: 'CANTEEN 02',
    title: '2. JEVAN',
    tagline: 'Ambur Dum Biryani, Executive Thalis, Banana Leaf Meals & Bowls',
    location: 'Block 12 • Central Food Court',
    avgPrep: '10–15 mins',
    upiId: 'jevan.vistas@okaxis',
  },
  {
    id: 'SSS Canteen',
    numberLabel: 'CANTEEN 03',
    title: '3. SSS Canteen',
    tagline: 'Ghee Podi Dosa, Sambar Idli, Bun Parotta, Chaat & Filter Coffee',
    location: 'Block 7 • Main Campus Canteen',
    avgPrep: '5–10 mins',
    upiId: 'ssscanteen.vistas@okaxis',
  },
];

const CATEGORIES: ('All' | CanteenCategory)[] = [
  'All',
  'South Indian & Tiffin',
  'Meals & Biryani',
  'Quick Bites & Snacks',
  'Fresh Juices & Beverages',
  'Healthy & Salads',
];

const BREAK_SLOTS = [
  'Immediate (Deliver to Classroom)',
  '11:15 AM Short Break',
  '01:00 PM Lunch Break',
  '03:30 PM Evening Break',
];

/**
 * Deterministic 21x21 SVG QR Code Renderer for UPI / CampusPay
 */
const PaymentQrCode: React.FC<{
  payload: string;
  amount: number;
  orderCode: string;
  canteenName: CanteenName;
}> = ({ payload, amount, orderCode, canteenName }) => {
  const matrix = useMemo(() => {
    const size = 21;
    const grid: boolean[][] = Array.from({ length: size }, () => Array(size).fill(false));

    const drawFinder = (r0: number, c0: number) => {
      for (let r = 0; r < 7; r++) {
        for (let c = 0; c < 7; c++) {
          const isBorder = r === 0 || r === 6 || c === 0 || c === 6;
          const isInner = r >= 2 && r <= 4 && c >= 2 && c <= 4;
          grid[r0 + r][c0 + c] = isBorder || isInner;
        }
      }
    };

    drawFinder(0, 0);
    drawFinder(0, size - 7);
    drawFinder(size - 7, 0);

    for (let i = 8; i < size - 8; i++) {
      grid[6][i] = i % 2 === 0;
      grid[i][6] = i % 2 === 0;
    }

    let hash = 2166136261;
    for (let i = 0; i < payload.length; i++) {
      hash ^= payload.charCodeAt(i);
      hash = Math.imul(hash, 16777619);
    }

    for (let r = 0; r < size; r++) {
      for (let c = 0; c < size; c++) {
        const inTopLeft = r < 8 && c < 8;
        const inTopRight = r < 8 && c >= size - 8;
        const inBottomLeft = r >= size - 8 && c < 8;
        const isTiming = r === 6 || c === 6;
        const inCenterBadge = r >= 8 && r <= 12 && c >= 8 && c <= 12;

        if (!inTopLeft && !inTopRight && !inBottomLeft && !isTiming && !inCenterBadge) {
          const bit = ((hash >>> ((r * size + c) % 24)) ^ (r * 13 + c * 7 + amount)) & 1;
          grid[r][c] = bit === 1;
        }
      }
    }
    return grid;
  }, [payload, amount]);

  return (
    <div className="relative inline-flex flex-col items-center p-3.5 rounded-2xl bg-white border-2 border-[#008F7A]/30 shadow-[0_12px_32px_rgba(0,143,122,0.16)]">
      <div className="flex items-center justify-between w-full mb-1.5 px-1 gap-2">
        <span className="text-[9px] font-mono font-bold uppercase tracking-widest text-[#008F7A] truncate">
          {canteenName} • QR
        </span>
        <span className="text-[10px] font-mono font-bold text-[#042f2e]">{orderCode}</span>
      </div>

      <svg
        viewBox="0 0 21 21"
        className="w-36 h-36 sm:w-40 sm:h-40 rounded-lg bg-white p-1"
        shapeRendering="crispEdges"
      >
        {matrix.map((row, rIdx) =>
          row.map((cell, cIdx) =>
            cell ? (
              <rect
                key={`${rIdx}-${cIdx}`}
                x={cIdx}
                y={rIdx}
                width={1}
                height={1}
                fill={
                  (rIdx < 7 && cIdx < 7) ||
                  (rIdx < 7 && cIdx >= 14) ||
                  (rIdx >= 14 && cIdx < 7)
                    ? '#008F7A'
                    : '#042f2e'
                }
              />
            ) : null
          )
        )}
        <rect x="8.2" y="8.2" width="4.6" height="4.6" rx="0.8" fill="#008F7A" />
        <text
          x="10.5"
          y="11.4"
          textAnchor="middle"
          fill="#ffffff"
          fontSize="2.8"
          fontWeight="bold"
          fontFamily="monospace"
        >
          ₹
        </text>
      </svg>

      <div className="mt-2 text-center">
        <p className="text-xs font-bold text-[#042f2e]">
          Pay ₹{amount} to {canteenName}
        </p>
        <p className="text-[10px] font-mono text-[#467874]">GPay • PhonePe • Paytm • CampusID</p>
      </div>
    </div>
  );
};

interface SmartCanteenModuleProps {
  embedded?: boolean;
}

export const SmartCanteenModule: React.FC<SmartCanteenModuleProps> = ({ embedded = false }) => {
  const {
    buildings,
    canteenMenu,
    canteenOrders,
    placeStudentOrder,
    canteenOwnerSendQuoteAndQr,
    markOrderPaidViaQr,
    updateCanteenOrderStatus,
    toggleMenuItemAvailability,
  } = useCampus();

  // View Mode: Split view shows both Student Classroom Order UI & Canteen Owner Terminal simultaneously
  const [viewMode, setViewMode] = useState<'split' | 'student' | 'owner'>('split');

  // Active Canteen Selection: 1. MOJO Cafe | 2. JEVAN | 3. SSS Canteen
  const [selectedCanteen, setSelectedCanteen] = useState<CanteenName>('MOJO Cafe');
  const [ownerFilterCanteen, setOwnerFilterCanteen] = useState<'ALL' | CanteenName>('ALL');

  // Student Menu & Cart State
  const [selectedCategory, setSelectedCategory] = useState<'All' | CanteenCategory>('All');
  const [vegOnly, setVegOnly] = useState(false);
  const [cart, setCart] = useState<Record<string, number>>({
    'mojo-1': 1,
    'mojo-3': 1,
  });

  // Student Classroom Order Form State
  const [studentName, setStudentName] = useState('Arjun Mehta');
  const [studentRollNo, setStudentRollNo] = useState('22CS1048');
  const [selectedBlockId, setSelectedBlockId] = useState('block-17');
  const [classroomNumber, setClassroomNumber] = useState('ROOM C-204');
  const [deliveryMode, setDeliveryMode] =
    useState<CanteenOrder['deliveryMode']>('Classroom Delivery');
  const [breakSlot, setBreakSlot] = useState(BREAK_SLOTS[0]);
  const [orderNotes, setOrderNotes] = useState('Deliver to 2nd Floor C-204 classroom door');
  const [orderSuccessToast, setOrderSuccessToast] = useState<string | null>(null);

  // Active Student Order Selected for Tracking & QR Payment
  const [selectedStudentOrderId, setSelectedStudentOrderId] = useState<string>(
    canteenOrders[0]?.id || ''
  );

  // Canteen Owner Quote Drafts per Order ID: { prepMins, cost }
  const [ownerDrafts, setOwnerDrafts] = useState<
    Record<string, { prepMins: number; cost: number }>
  >({});

  const activeCanteenInfo = useMemo(
    () => CANTEENS_LIST.find((c) => c.id === selectedCanteen) || CANTEENS_LIST[0],
    [selectedCanteen]
  );

  const handleSelectCanteen = (canteen: CanteenName) => {
    setSelectedCanteen(canteen);
    setSelectedCategory('All');
  };

  const getOwnerDraft = (order: CanteenOrder) => {
    if (ownerDrafts[order.id]) return ownerDrafts[order.id];
    const estimatedPrep = Math.max(
      10,
      order.items.reduce((max, it) => {
        const menuObj = canteenMenu.find((m) => m.id === it.menuItemId);
        return Math.max(max, menuObj?.defaultPrepMins || 12);
      }, 10)
    );
    return {
      prepMins: order.prepTimeMinutes ?? estimatedPrep,
      cost: order.confirmedCost || order.subtotal + order.deliveryFee,
    };
  };

  const setOwnerDraftField = (
    order: CanteenOrder,
    field: 'prepMins' | 'cost',
    value: number
  ) => {
    const current = getOwnerDraft(order);
    setOwnerDrafts((prev) => ({
      ...prev,
      [order.id]: {
        ...current,
        [field]: value,
      },
    }));
  };

  // Filtered menu for the currently selected Canteen (MOJO Cafe, JEVAN, or SSS Canteen)
  const filteredMenu = useMemo(() => {
    return canteenMenu.filter((item) => {
      const canteenMatch = item.canteenName === selectedCanteen;
      const catMatch = selectedCategory === 'All' || item.category === selectedCategory;
      const vegMatch = !vegOnly || item.isVeg;
      return canteenMatch && catMatch && vegMatch;
    });
  }, [canteenMenu, selectedCanteen, selectedCategory, vegOnly]);

  const cartItems: CanteenOrderItem[] = useMemo(() => {
    return Object.entries(cart)
      .filter(([, qty]) => qty > 0)
      .map(([menuId, quantity]) => {
        const item = canteenMenu.find((m) => m.id === menuId);
        if (!item) return null;
        return {
          menuItemId: item.id,
          name: item.name,
          canteenName: item.canteenName,
          price: item.price,
          quantity,
          isVeg: item.isVeg,
        };
      })
      .filter(Boolean) as CanteenOrderItem[];
  }, [cart, canteenMenu]);

  const cartSubtotal = useMemo(
    () => cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0),
    [cartItems]
  );
  const deliveryFee = deliveryMode === 'Classroom Delivery' ? 10 : 0;
  const cartEstimatedTotal = cartSubtotal + (cartItems.length > 0 ? deliveryFee : 0);

  const updateCartQty = (menuId: string, delta: number) => {
    setCart((prev) => {
      const nextQty = Math.max(0, (prev[menuId] || 0) + delta);
      if (nextQty === 0) {
        const copy = { ...prev };
        delete copy[menuId];
        return copy;
      }
      return { ...prev, [menuId]: nextQty };
    });
  };

  const handlePlaceOrderFromClass = (e: React.FormEvent) => {
    e.preventDefault();
    if (cartItems.length === 0) return;

    const primaryCanteen = cartItems[0]?.canteenName || selectedCanteen;

    const created = placeStudentOrder({
      canteenName: primaryCanteen,
      studentName,
      studentRollNo,
      blockId: selectedBlockId,
      classroomNumber,
      deliveryMode,
      breakSlot,
      notes: orderNotes,
      items: cartItems,
    });

    setSelectedStudentOrderId(created.id);
    setOrderSuccessToast(
      `Order ${created.orderCode} sent from ${created.classroomNumber} to ${primaryCanteen} Owner!`
    );
    setTimeout(() => setOrderSuccessToast(null), 5000);
  };

  const activeStudentOrder = useMemo(
    () =>
      canteenOrders.find((o) => o.id === selectedStudentOrderId) ||
      canteenOrders[0] ||
      null,
    [canteenOrders, selectedStudentOrderId]
  );

  const filteredOwnerOrders = useMemo(() => {
    if (ownerFilterCanteen === 'ALL') return canteenOrders;
    return canteenOrders.filter((o) => o.canteenName === ownerFilterCanteen);
  }, [canteenOrders, ownerFilterCanteen]);

  const pendingOwnerCount = useMemo(
    () => canteenOrders.filter((o) => o.status === 'Pending Owner Quote').length,
    [canteenOrders]
  );

  return (
    <div className="space-y-6">
      {/* Top Header & Role View Switcher */}
      <div className="glass-panel rounded-3xl p-5 sm:p-6 border border-teal-600/20">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/15 border border-teal-600/25 text-[#007F6E] text-[11px] font-mono font-semibold uppercase tracking-widest mb-2">
              <UtensilsCrossed className="h-3.5 w-3.5" />
              <span>3 CAMPUS CANTEENS • CLASSROOM-TO-KITCHEN LIVE QR ORDERING</span>
            </div>
            <h2 className="font-display text-2xl sm:text-3xl font-bold text-[#042f2e] tracking-tight">
              1. MOJO Cafe • 2. JEVAN • 3. SSS Canteen
            </h2>
            <p className="text-sm text-[#1f5754] mt-1 max-w-2xl">
              Select a canteen below to view its live menu, place an order directly from your
              classroom, and receive the{' '}
              <span className="font-semibold text-[#007F6E]">Preparation Time</span>,{' '}
              <span className="font-semibold text-[#007F6E]">Confirmed Cost</span>, and{' '}
              <span className="font-semibold text-[#007F6E]">Payment QR Code</span> from the
              Canteen Owner.
            </p>
          </div>

          {/* Role / View Switcher */}
          <div className="flex flex-wrap items-center gap-2 bg-white/80 p-1.5 rounded-2xl border border-teal-600/20 self-start">
            <button
              onClick={() => setViewMode('split')}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                viewMode === 'split'
                  ? 'btn-ocean-primary bg-gradient-to-r from-[#008F7A] to-[#14B8A6] shadow-md'
                  : 'text-[#1f5754] hover:bg-teal-500/10'
              }`}
            >
              <LayoutGrid className="h-3.5 w-3.5" />
              <span>Split Live View (Both)</span>
            </button>
            <button
              onClick={() => setViewMode('student')}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                viewMode === 'student'
                  ? 'btn-ocean-primary bg-gradient-to-r from-[#008F7A] to-[#14B8A6] shadow-md'
                  : 'text-[#1f5754] hover:bg-teal-500/10'
              }`}
            >
              <Smartphone className="h-3.5 w-3.5" />
              <span>Student Classroom App</span>
            </button>
            <button
              onClick={() => setViewMode('owner')}
              className={`relative flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                viewMode === 'owner'
                  ? 'btn-ocean-primary bg-gradient-to-r from-[#008F7A] to-[#14B8A6] shadow-md'
                  : 'text-[#1f5754] hover:bg-teal-500/10'
              }`}
            >
              <ChefHat className="h-3.5 w-3.5" />
              <span>Canteen Owner Terminal</span>
              {pendingOwnerCount > 0 && (
                <span className="ml-1 px-1.5 py-0.2 rounded-full bg-rose-500 !text-white text-[10px] font-mono font-bold">
                  {pendingOwnerCount}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* ============================================================
            3 CAMPUS CANTEEN SELECTOR CARDS:
            1. MOJO Cafe | 2. JEVAN | 3. SSS Canteen
        ============================================================ */}
        <div className="mt-5 pt-5 border-t border-teal-600/15">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[11px] font-mono font-bold uppercase tracking-widest text-[#008F7A]">
              CHOOSE YOUR CAMPUS CANTEEN TO VIEW MENU:
            </span>
            <span className="text-xs font-semibold text-[#1f5754]">
              Showing Menu for: <strong className="text-[#008F7A]">{activeCanteenInfo.title}</strong>
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
            {CANTEENS_LIST.map((cnt, idx) => {
              const isSelected = selectedCanteen === cnt.id;
              const menuCount = canteenMenu.filter((m) => m.canteenName === cnt.id).length;
              const Icon = idx === 0 ? Coffee : idx === 1 ? Soup : Store;

              return (
                <button
                  key={cnt.id}
                  type="button"
                  onClick={() => handleSelectCanteen(cnt.id)}
                  className={`text-left p-4 rounded-2xl border-2 transition-all cursor-pointer flex flex-col justify-between ${
                    isSelected
                      ? 'bg-white border-[#008F7A] shadow-[0_12px_30px_rgba(0,143,122,0.18)] scale-[1.01]'
                      : 'bg-white/70 border-teal-600/15 hover:bg-white/90 hover:border-teal-600/35'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between gap-2">
                      <span
                        className={`text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full ${
                          isSelected
                            ? 'bg-[#008F7A] !text-white'
                            : 'bg-teal-500/15 text-[#007F6E]'
                        }`}
                      >
                        {cnt.numberLabel}
                      </span>
                      <span className="text-[10px] font-mono font-semibold text-[#467874]">
                        {menuCount} Dishes • ~{cnt.avgPrep}
                      </span>
                    </div>

                    <div className="flex items-center gap-2.5 mt-2.5">
                      <div
                        className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${
                          isSelected
                            ? 'bg-gradient-to-br from-[#008F7A] to-[#14B8A6] !text-white'
                            : 'bg-teal-500/15 text-[#008F7A]'
                        }`}
                      >
                        <Icon className={`h-4 w-4 ${isSelected ? '!text-white' : ''}`} />
                      </div>
                      <div>
                        <h3 className="font-display text-base sm:text-lg font-extrabold text-[#042f2e]">
                          {cnt.title}
                        </h3>
                        <p className="text-[11px] font-mono text-[#007F6E]">{cnt.location}</p>
                      </div>
                    </div>

                    <p className="text-xs text-[#1f5754] mt-2 line-clamp-2">{cnt.tagline}</p>
                  </div>

                  <div className="mt-3 pt-2 border-t border-teal-600/10 flex items-center justify-between text-[11px] font-bold">
                    <span className={isSelected ? 'text-[#008F7A]' : 'text-[#467874]'}>
                      {isSelected ? '● Active Menu Selected' : 'Click to View Menu →'}
                    </span>
                    <span className="font-mono text-[10px] text-emerald-700 bg-emerald-500/15 px-2 py-0.5 rounded">
                      OPEN NOW
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Toast Notification when student submits an order */}
      <AnimatePresence>
        {orderSuccessToast && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="rounded-2xl bg-emerald-600 !text-white px-5 py-3.5 shadow-lg flex items-center justify-between gap-3"
          >
            <div className="flex items-center gap-2.5">
              <CheckCircle2 className="h-5 w-5 shrink-0 !text-white" />
              <span className="text-xs sm:text-sm font-semibold !text-white">
                {orderSuccessToast}
              </span>
            </div>
            <span className="text-[11px] font-mono uppercase tracking-wider bg-white/20 px-2.5 py-1 rounded-lg !text-white">
              Check Owner Terminal →
            </span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* MAIN INTERACTIVE WORKSPACE */}
      <div
        className={`grid gap-6 ${
          viewMode === 'split' ? 'grid-cols-1 xl:grid-cols-12' : 'grid-cols-1'
        }`}
      >
        {/* ============================================================
            LEFT COLUMN: STUDENT CLASSROOM ORDERING + MENU + LIVE QR TRACKER
        ============================================================ */}
        {(viewMode === 'split' || viewMode === 'student') && (
          <div
            className={`${
              viewMode === 'split' ? 'xl:col-span-7' : 'col-span-1'
            } space-y-6`}
          >
            {/* 1. STUDENT MENU BROWSER FOR SELECTED CANTEEN */}
            <div className="glass-panel rounded-3xl p-5 sm:p-6 border border-teal-600/20">
              <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
                <div>
                  <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-[#008F7A]">
                    STUDENT PORTAL • {activeCanteenInfo.numberLabel} MENU
                  </span>
                  <h3 className="font-display text-xl font-bold text-[#042f2e]">
                    {activeCanteenInfo.title} — Student Menu Choice
                  </h3>
                  <p className="text-xs text-[#467874]">{activeCanteenInfo.tagline}</p>
                </div>

                {/* Veg Only Toggle */}
                <button
                  type="button"
                  onClick={() => setVegOnly(!vegOnly)}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                    vegOnly
                      ? 'bg-emerald-500/20 border-emerald-600/40 text-emerald-900'
                      : 'bg-white/80 border-teal-600/20 text-[#1f5754]'
                  }`}
                >
                  <span
                    className={`h-2.5 w-2.5 rounded-full ${
                      vegOnly ? 'bg-emerald-600' : 'bg-slate-400'
                    }`}
                  />
                  Pure Veg Only
                </button>
              </div>

              {/* Quick Canteen Switcher Pills + Category Pills */}
              <div className="flex flex-wrap items-center gap-2 pb-2 mb-4 border-b border-teal-600/10">
                {CANTEENS_LIST.map((c) => (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => handleSelectCanteen(c.id)}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all border cursor-pointer ${
                      selectedCanteen === c.id
                        ? 'btn-ocean-primary bg-gradient-to-r from-[#008F7A] to-[#14B8A6] border-white/50 shadow-sm'
                        : 'bg-white/80 text-[#042f2e] border-teal-600/20 hover:border-[#008F7A]'
                    }`}
                  >
                    {c.title}
                  </button>
                ))}

                <span className="text-teal-600/30 mx-1">|</span>

                {CATEGORIES.map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-3 py-1 rounded-lg text-[11px] font-semibold whitespace-nowrap transition-all border cursor-pointer ${
                      selectedCategory === cat
                        ? 'bg-teal-500/20 text-[#007F6E] border-teal-600/40 font-bold'
                        : 'bg-white/60 text-[#467874] border-teal-600/10 hover:text-[#042f2e]'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              {/* Menu Grid */}
              <div
                className={`grid grid-cols-1 sm:grid-cols-2 gap-3.5 ${
                  embedded ? 'max-h-[440px]' : 'max-h-[540px]'
                } overflow-y-auto pr-1`}
              >
                {filteredMenu.map((item) => {
                  const qty = cart[item.id] || 0;
                  return (
                    <div
                      key={item.id}
                      className={`p-4 rounded-2xl border transition-all flex flex-col justify-between ${
                        !item.available
                          ? 'bg-white/40 border-teal-600/10 opacity-60'
                          : qty > 0
                          ? 'bg-white/95 border-[#008F7A] shadow-[0_8px_24px_rgba(0,143,122,0.14)]'
                          : 'bg-white/80 border-teal-600/15 hover:border-teal-600/35'
                      }`}
                    >
                      <div>
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex items-center gap-1.5">
                            {/* Veg / Non-Veg Icon */}
                            <span
                              className={`inline-flex h-4 w-4 items-center justify-center rounded border ${
                                item.isVeg
                                  ? 'border-emerald-600 bg-emerald-50'
                                  : 'border-rose-600 bg-rose-50'
                              }`}
                            >
                              <span
                                className={`h-2 w-2 rounded-full ${
                                  item.isVeg ? 'bg-emerald-600' : 'bg-rose-600'
                                }`}
                              />
                            </span>
                            <span className="text-[10px] font-mono font-bold text-[#008F7A] bg-teal-500/12 px-2 py-0.5 rounded-md">
                              {item.canteenName}
                            </span>
                          </div>
                          <div className="flex items-center gap-1 text-amber-600 text-[11px] font-bold">
                            <Star className="h-3 w-3 fill-amber-400 text-amber-500" />
                            <span>{item.rating}</span>
                          </div>
                        </div>

                        <h4 className="font-display text-sm font-bold text-[#042f2e] mt-2">
                          {item.name}
                        </h4>
                        <p className="text-[11px] text-[#467874] mt-1 line-clamp-2">
                          {item.description}
                        </p>
                      </div>

                      <div className="mt-3 pt-2.5 border-t border-teal-600/10 flex items-center justify-between gap-2">
                        <div>
                          <span className="font-display text-base font-bold text-[#042f2e]">
                            ₹{item.price}
                          </span>
                          <span className="text-[10px] font-mono text-[#467874] block">
                            ~{item.defaultPrepMins} mins • {item.calories}
                          </span>
                        </div>

                        {!item.available ? (
                          <span className="text-[10px] font-mono font-semibold text-rose-600 px-2.5 py-1 rounded-lg bg-rose-500/10">
                            Sold Out
                          </span>
                        ) : qty === 0 ? (
                          <button
                            type="button"
                            onClick={() => updateCartQty(item.id, 1)}
                            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-teal-500/15 hover:bg-[#008F7A] text-[#007F6E] hover:!text-white text-xs font-bold border border-teal-600/25 transition-all cursor-pointer"
                          >
                            <Plus className="h-3.5 w-3.5" /> Add
                          </button>
                        ) : (
                          <div className="inline-flex items-center gap-2 px-2 py-1 rounded-xl bg-[#008F7A] !text-white">
                            <button
                              type="button"
                              onClick={() => updateCartQty(item.id, -1)}
                              className="p-0.5 hover:bg-white/20 rounded !text-white cursor-pointer"
                            >
                              <Minus className="h-3.5 w-3.5 !text-white" />
                            </button>
                            <span className="font-mono text-xs font-bold min-w-[16px] text-center !text-white">
                              {qty}
                            </span>
                            <button
                              type="button"
                              onClick={() => updateCartQty(item.id, 1)}
                              className="p-0.5 hover:bg-white/20 rounded !text-white cursor-pointer"
                            >
                              <Plus className="h-3.5 w-3.5 !text-white" />
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* 2. CLASSROOM ORDER FORM (STUDENT SENDS ORDER FROM CLASS) */}
            <form
              onSubmit={handlePlaceOrderFromClass}
              className="glass-panel rounded-3xl p-5 sm:p-6 border border-teal-600/25"
            >
              <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
                <div>
                  <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-[#008F7A]">
                    STUDENT PORTAL • STEP 2 • ORDERING FROM {selectedCanteen.toUpperCase()}
                  </span>
                  <h3 className="font-display text-lg sm:text-xl font-bold text-[#042f2e]">
                    Student Classroom Details & Send Order to {selectedCanteen}
                  </h3>
                </div>
                <span className="px-3 py-1 rounded-full bg-teal-500/15 text-[#007F6E] font-mono text-xs font-bold">
                  {cartItems.reduce((s, i) => s + i.quantity, 0)} Items Selected
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 mb-4">
                <div>
                  <label className="block text-[11px] font-mono font-semibold uppercase text-[#1f5754] mb-1">
                    Student Name
                  </label>
                  <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white/85 border border-teal-600/20">
                    <User className="h-4 w-4 text-[#008F7A] shrink-0" />
                    <input
                      type="text"
                      value={studentName}
                      onChange={(e) => setStudentName(e.target.value)}
                      required
                      className="w-full bg-transparent text-xs font-semibold text-[#042f2e] focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-mono font-semibold uppercase text-[#1f5754] mb-1">
                    Register / Roll Number
                  </label>
                  <input
                    type="text"
                    value={studentRollNo}
                    onChange={(e) => setStudentRollNo(e.target.value)}
                    required
                    className="w-full px-3 py-2 rounded-xl bg-white/85 border border-teal-600/20 text-xs font-mono font-semibold text-[#042f2e] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-mono font-semibold uppercase text-[#1f5754] mb-1">
                    Select Campus Block / Academic Wing
                  </label>
                  <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white/85 border border-teal-600/20">
                    <Building2 className="h-4 w-4 text-[#008F7A] shrink-0" />
                    <select
                      value={selectedBlockId}
                      onChange={(e) => setSelectedBlockId(e.target.value)}
                      className="w-full bg-transparent text-xs font-semibold text-[#042f2e] focus:outline-none"
                    >
                      {buildings.map((b) => (
                        <option key={b.id} value={b.id}>
                          {b.code} — {b.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-mono font-semibold uppercase text-[#1f5754] mb-1">
                    Classroom / Lab Number
                  </label>
                  <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white/85 border border-teal-600/20">
                    <MapPin className="h-4 w-4 text-[#008F7A] shrink-0" />
                    <input
                      type="text"
                      value={classroomNumber}
                      onChange={(e) => setClassroomNumber(e.target.value)}
                      placeholder="e.g., ROOM C-204"
                      required
                      className="w-full bg-transparent text-xs font-mono font-bold text-[#042f2e] focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-mono font-semibold uppercase text-[#1f5754] mb-1">
                    Delivery / Pickup Mode
                  </label>
                  <select
                    value={deliveryMode}
                    onChange={(e) =>
                      setDeliveryMode(e.target.value as CanteenOrder['deliveryMode'])
                    }
                    className="w-full px-3 py-2 rounded-xl bg-white/85 border border-teal-600/20 text-xs font-semibold text-[#042f2e] focus:outline-none"
                  >
                    <option value="Classroom Delivery">
                      Classroom Corridor Delivery (+₹10)
                    </option>
                    <option value="Express Counter Pickup">
                      Express Counter Pickup (₹0)
                    </option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-mono font-semibold uppercase text-[#1f5754] mb-1">
                    Class Break / Timing Slot
                  </label>
                  <select
                    value={breakSlot}
                    onChange={(e) => setBreakSlot(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-white/85 border border-teal-600/20 text-xs font-semibold text-[#042f2e] focus:outline-none"
                  >
                    {BREAK_SLOTS.map((slot) => (
                      <option key={slot} value={slot}>
                        {slot}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Selected Items Summary */}
              <div className="p-3.5 rounded-2xl bg-white/80 border border-teal-600/15 mb-4">
                {cartItems.length === 0 ? (
                  <p className="text-xs text-[#467874] text-center py-2">
                    Your tray is empty. Pick dishes from 1. MOJO Cafe, 2. JEVAN, or 3. SSS Canteen above.
                  </p>
                ) : (
                  <div className="space-y-2">
                    {cartItems.map((item) => (
                      <div
                        key={item.menuItemId}
                        className="flex items-center justify-between text-xs"
                      >
                        <span className="font-semibold text-[#042f2e]">
                          {item.quantity}x {item.name}{' '}
                          <span className="text-[10px] font-mono text-[#008F7A]">
                            [{item.canteenName}]
                          </span>
                        </span>
                        <span className="font-mono font-bold text-[#007F6E]">
                          ₹{item.price * item.quantity}
                        </span>
                      </div>
                    ))}
                    <div className="pt-2 border-t border-teal-600/15 flex items-center justify-between text-xs font-bold text-[#042f2e]">
                      <span>
                        Estimated Total{' '}
                        {deliveryFee > 0 ? `(incl. ₹${deliveryFee} Classroom Delivery)` : ''}
                      </span>
                      <span className="text-base font-display text-[#008F7A]">
                        ₹{cartEstimatedTotal}
                      </span>
                    </div>
                  </div>
                )}
              </div>

              <button
                type="submit"
                disabled={cartItems.length === 0}
                className="btn-ocean-primary w-full py-3 px-5 rounded-2xl bg-gradient-to-r from-[#008F7A] to-[#14B8A6] hover:opacity-95 disabled:opacity-40 font-display text-sm font-bold shadow-lg flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                <Send className="h-4 w-4" />
                <span>
                  Send Order from {classroomNumber} to {selectedCanteen} Owner (₹
                  {cartEstimatedTotal})
                </span>
              </button>
            </form>

            {/* 3. STUDENT LIVE ORDER STATUS & UPI QR PAYMENT RECEIVER */}
            {activeStudentOrder && (
              <div className="glass-panel rounded-3xl p-5 sm:p-6 border-2 border-[#008F7A]/35">
                <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
                  <div>
                    <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-[#008F7A]">
                      STUDENT PORTAL • STEP 3 • LIVE {activeStudentOrder.canteenName.toUpperCase()} RESPONSE & QR PAYMENT
                    </span>
                    <h3 className="font-display text-xl font-bold text-[#042f2e]">
                      Your Active Classroom Order ({activeStudentOrder.orderCode} •{' '}
                      {activeStudentOrder.canteenName})
                    </h3>
                  </div>

                  {/* Switch between recent student orders */}
                  <div className="flex items-center gap-1.5">
                    {canteenOrders.slice(0, 4).map((ord) => (
                      <button
                        key={ord.id}
                        type="button"
                        onClick={() => setSelectedStudentOrderId(ord.id)}
                        className={`px-2.5 py-1 rounded-lg font-mono text-[11px] font-bold border transition-all cursor-pointer ${
                          activeStudentOrder.id === ord.id
                            ? 'bg-[#008F7A] !text-white border-[#008F7A]'
                            : 'bg-white/75 text-[#1f5754] border-teal-600/20'
                        }`}
                      >
                        {ord.orderCode}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-center">
                  {/* Left Info: Canteen Owner's Prep Time + Cost + Status */}
                  <div className="md:col-span-7 space-y-3.5">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="px-2.5 py-1 rounded-lg bg-[#008F7A] !text-white font-mono text-xs font-bold">
                        {activeStudentOrder.canteenName}
                      </span>
                      <span className="px-2.5 py-1 rounded-lg bg-teal-500/15 text-[#007F6E] font-mono text-xs font-bold">
                        {activeStudentOrder.classroomNumber} • {activeStudentOrder.blockName}
                      </span>
                      <span
                        className={`px-2.5 py-1 rounded-lg font-mono text-xs font-bold ${
                          activeStudentOrder.status === 'Pending Owner Quote'
                            ? 'bg-amber-500/20 text-amber-800'
                            : activeStudentOrder.status === 'Quote & QR Sent'
                            ? 'bg-cyan-500/20 text-[#007F6E]'
                            : 'bg-emerald-500/20 text-emerald-800'
                        }`}
                      >
                        {activeStudentOrder.status}
                      </span>
                    </div>

                    {/* Preparation Time & Cost Cards returned by Canteen Owner */}
                    <div className="grid grid-cols-2 gap-3">
                      <div className="p-3.5 rounded-2xl bg-white/90 border border-teal-600/20">
                        <div className="flex items-center gap-1.5 text-[10px] font-mono font-bold uppercase text-[#467874]">
                          <Clock className="h-3.5 w-3.5 text-[#008F7A]" />
                          <span>PREPARATION TIME</span>
                        </div>
                        {activeStudentOrder.prepTimeMinutes !== null ? (
                          <p className="font-display text-2xl font-bold text-[#042f2e] mt-1">
                            {activeStudentOrder.prepTimeMinutes}{' '}
                            <span className="text-xs font-normal text-[#467874]">mins</span>
                          </p>
                        ) : (
                          <p className="text-xs font-semibold text-amber-700 mt-1.5">
                            Waiting for {activeStudentOrder.canteenName} Owner...
                          </p>
                        )}
                      </div>

                      <div className="p-3.5 rounded-2xl bg-white/90 border border-teal-600/20">
                        <div className="flex items-center gap-1.5 text-[10px] font-mono font-bold uppercase text-[#467874]">
                          <IndianRupee className="h-3.5 w-3.5 text-[#008F7A]" />
                          <span>CONFIRMED COST</span>
                        </div>
                        <p className="font-display text-2xl font-bold text-[#008F7A] mt-1">
                          ₹{activeStudentOrder.confirmedCost}
                        </p>
                        <span className="text-[10px] font-mono text-[#467874]">
                          {activeStudentOrder.paymentStatus}
                        </span>
                      </div>
                    </div>

                    {/* Item breakdown */}
                    <div className="p-3 rounded-2xl bg-white/75 border border-teal-600/15 space-y-1">
                      {activeStudentOrder.items.map((it) => (
                        <div
                          key={it.menuItemId}
                          className="flex items-center justify-between text-xs text-[#1f5754]"
                        >
                          <span>
                            {it.quantity}x {it.name}
                          </span>
                          <span className="font-mono font-semibold">
                            ₹{it.price * it.quantity}
                          </span>
                        </div>
                      ))}
                    </div>

                    {/* Payment Action */}
                    {activeStudentOrder.paymentStatus === 'QR Ready - Unpaid' && (
                      <button
                        type="button"
                        onClick={() => markOrderPaidViaQr(activeStudentOrder.id)}
                        className="btn-ocean-primary w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-[#008F7A] to-[#14B8A6] font-display text-xs font-bold shadow-md flex items-center justify-center gap-2 cursor-pointer"
                      >
                        <QrCode className="h-4 w-4" />
                        <span>
                          Simulate QR Scan & Pay ₹{activeStudentOrder.confirmedCost} to{' '}
                          {activeStudentOrder.canteenName}
                        </span>
                      </button>
                    )}

                    {activeStudentOrder.paymentStatus === 'Paid via UPI QR' && (
                      <div className="flex items-center gap-2 p-3 rounded-xl bg-emerald-500/15 border border-emerald-600/30 text-emerald-900 text-xs font-bold">
                        <ShieldCheck className="h-4 w-4 text-emerald-700 shrink-0" />
                        <span>
                          Payment of ₹{activeStudentOrder.confirmedCost} Verified via QR!{' '}
                          {activeStudentOrder.canteenName} is preparing your order (
                          {activeStudentOrder.prepTimeMinutes} mins).
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Right Info: Live Scannable QR Code */}
                  <div className="md:col-span-5 flex flex-col items-center justify-center">
                    {activeStudentOrder.prepTimeMinutes !== null &&
                    activeStudentOrder.upiPayload ? (
                      <PaymentQrCode
                        payload={activeStudentOrder.upiPayload}
                        amount={activeStudentOrder.confirmedCost}
                        orderCode={activeStudentOrder.orderCode}
                        canteenName={activeStudentOrder.canteenName}
                      />
                    ) : (
                      <div className="p-6 rounded-2xl bg-white/70 border border-dashed border-teal-600/30 text-center max-w-xs">
                        <QrCode className="h-10 w-10 text-[#008F7A]/50 mx-auto mb-2 animate-pulse" />
                        <p className="text-xs font-bold text-[#042f2e]">
                          Awaiting {activeStudentOrder.canteenName} Owner Quote
                        </p>
                        <p className="text-[11px] text-[#467874] mt-1">
                          As soon as the Canteen Owner enters the preparation time & cost in the
                          terminal, your payment QR code appears here automatically.
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ============================================================
            RIGHT COLUMN: CANTEEN OWNER LIVE TERMINAL
            (RECEIVES CLASSROOM ORDERS FOR MOJO CAFE, JEVAN & SSS CANTEEN)
        ============================================================ */}
        {(viewMode === 'split' || viewMode === 'owner') && (
          <div
            className={`${
              viewMode === 'split' ? 'xl:col-span-5' : 'col-span-1'
            } space-y-6`}
          >
            <div className="glass-panel rounded-3xl p-5 sm:p-6 border border-teal-600/25">
              <div className="flex items-center justify-between gap-2 mb-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="h-2.5 w-2.5 rounded-full bg-emerald-500 animate-ping" />
                    <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-[#008F7A]">
                      CANTEEN OWNER CONSOLE • LIVE KITCHEN DISPATCH
                    </span>
                  </div>
                  <h3 className="font-display text-xl font-bold text-[#042f2e] mt-0.5">
                    Incoming Classroom Orders ({filteredOwnerOrders.length})
                  </h3>
                </div>

                <div className="px-3 py-1.5 rounded-xl bg-teal-500/15 border border-teal-600/25 text-right">
                  <span className="text-[10px] font-mono text-[#467874] block">PENDING QUOTE</span>
                  <span className="font-mono text-sm font-bold text-[#007F6E]">
                    {pendingOwnerCount} Orders
                  </span>
                </div>
              </div>

              {/* Filter Owner Terminal by Canteen: All | 1. MOJO Cafe | 2. JEVAN | 3. SSS Canteen */}
              <div className="flex flex-wrap items-center gap-1.5 mb-4 pb-3 border-b border-teal-600/15">
                {(['ALL', 'MOJO Cafe', 'JEVAN', 'SSS Canteen'] as const).map((cnt) => (
                  <button
                    key={cnt}
                    type="button"
                    onClick={() => setOwnerFilterCanteen(cnt)}
                    className={`px-3 py-1.5 rounded-xl text-[11px] font-mono font-bold border transition-all cursor-pointer ${
                      ownerFilterCanteen === cnt
                        ? 'bg-[#008F7A] !text-white border-[#008F7A]'
                        : 'bg-white/75 text-[#1f5754] border-teal-600/20 hover:border-[#008F7A]'
                    }`}
                  >
                    {cnt === 'ALL'
                      ? 'All 3 Canteens'
                      : cnt === 'MOJO Cafe'
                      ? '1. MOJO Cafe'
                      : cnt === 'JEVAN'
                      ? '2. JEVAN'
                      : '3. SSS Canteen'}
                  </button>
                ))}
              </div>

              {/* Incoming Orders List */}
              <div className="space-y-4 max-h-[880px] overflow-y-auto pr-1">
                {filteredOwnerOrders.map((order) => {
                  const draft = getOwnerDraft(order);
                  const isPendingQuote = order.status === 'Pending Owner Quote';

                  return (
                    <div
                      key={order.id}
                      className={`p-4 sm:p-5 rounded-2xl border transition-all ${
                        isPendingQuote
                          ? 'bg-amber-50/90 border-amber-400 shadow-[0_10px_25px_rgba(245,158,11,0.15)]'
                          : 'bg-white/90 border-teal-600/20'
                      }`}
                    >
                      {/* Order Top Bar */}
                      <div className="flex flex-wrap items-start justify-between gap-2 pb-3 border-b border-teal-600/15">
                        <div>
                          <div className="flex flex-wrap items-center gap-1.5">
                            <span className="font-mono text-[11px] font-bold px-2 py-0.5 rounded bg-[#008F7A] !text-white">
                              {order.canteenName}
                            </span>
                            <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-teal-500/15 text-[#007F6E]">
                              {order.orderCode}
                            </span>
                            <span className="text-xs font-bold text-[#042f2e]">
                              {order.studentName}{' '}
                              <span className="font-mono text-[11px] text-[#467874]">
                                ({order.studentRollNo})
                              </span>
                            </span>
                          </div>
                          <div className="flex flex-wrap items-center gap-2 mt-1.5 text-[11px] font-semibold text-[#007F6E]">
                            <span className="inline-flex items-center gap-1">
                              <MapPin className="h-3.5 w-3.5" />
                              {order.classroomNumber} • {order.blockName}
                            </span>
                            <span>•</span>
                            <span>{order.breakSlot}</span>
                          </div>
                        </div>

                        <span
                          className={`text-[10px] font-mono font-bold px-2.5 py-1 rounded-full ${
                            order.paymentStatus === 'Paid via UPI QR'
                              ? 'bg-emerald-500/20 text-emerald-800 border border-emerald-500/30'
                              : order.paymentStatus === 'QR Ready - Unpaid'
                              ? 'bg-cyan-500/20 text-[#007F6E] border border-cyan-500/30'
                              : 'bg-amber-500/25 text-amber-900 border border-amber-500/40'
                          }`}
                        >
                          {order.paymentStatus}
                        </span>
                      </div>

                      {/* Ordered Dishes */}
                      <div className="my-3 space-y-1.5">
                        {order.items.map((item) => (
                          <div
                            key={item.menuItemId}
                            className="flex items-center justify-between text-xs"
                          >
                            <span className="font-semibold text-[#042f2e]">
                              {item.quantity}x {item.name}
                            </span>
                            <span className="font-mono text-[#1f5754]">
                              ₹{item.price * item.quantity}
                            </span>
                          </div>
                        ))}
                        {order.notes && (
                          <p className="text-[11px] italic text-[#467874] pt-1">
                            Note: "{order.notes}"
                          </p>
                        )}
                      </div>

                      {/* OWNER ACTION BOX: SET PREPARATION TIME (MINS) & CONFIRMED COST (₹) */}
                      <div className="p-3.5 rounded-2xl bg-teal-50/80 border border-teal-600/20 space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#007F6E]">
                            {order.canteenName.toUpperCase()} OWNER: SET PREP TIME & COST
                          </span>
                          <span className="text-[10px] font-mono text-[#467874]">
                            {order.deliveryMode}
                          </span>
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                          {/* Preparation Time Input */}
                          <div>
                            <label className="block text-[10px] font-mono font-semibold text-[#1f5754] mb-1">
                              Preparation Time (Mins)
                            </label>
                            <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-white border border-teal-600/25">
                              <Clock className="h-3.5 w-3.5 text-[#008F7A]" />
                              <input
                                type="number"
                                min={1}
                                max={90}
                                value={draft.prepMins}
                                onChange={(e) =>
                                  setOwnerDraftField(
                                    order,
                                    'prepMins',
                                    Number(e.target.value) || 10
                                  )
                                }
                                className="w-full bg-transparent font-mono text-xs font-bold text-[#042f2e] focus:outline-none"
                              />
                              <span className="text-[10px] font-mono text-[#467874]">min</span>
                            </div>
                            {/* Quick Prep Presets */}
                            <div className="flex items-center gap-1 mt-1.5">
                              {[8, 12, 15, 20].map((m) => (
                                <button
                                  key={m}
                                  type="button"
                                  onClick={() => setOwnerDraftField(order, 'prepMins', m)}
                                  className={`px-2 py-0.5 rounded text-[10px] font-mono font-semibold border cursor-pointer ${
                                    draft.prepMins === m
                                      ? 'bg-[#008F7A] !text-white border-[#008F7A]'
                                      : 'bg-white text-[#1f5754] border-teal-600/20'
                                  }`}
                                >
                                  {m}m
                                </button>
                              ))}
                            </div>
                          </div>

                          {/* Total Cost Input */}
                          <div>
                            <label className="block text-[10px] font-mono font-semibold text-[#1f5754] mb-1">
                              Total Cost (₹ INR)
                            </label>
                            <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-white border border-teal-600/25">
                              <IndianRupee className="h-3.5 w-3.5 text-[#008F7A]" />
                              <input
                                type="number"
                                min={1}
                                value={draft.cost}
                                onChange={(e) =>
                                  setOwnerDraftField(order, 'cost', Number(e.target.value) || 0)
                                }
                                className="w-full bg-transparent font-mono text-xs font-bold text-[#042f2e] focus:outline-none"
                              />
                            </div>
                            <span className="text-[10px] font-mono text-[#467874] block mt-1.5">
                              Items ₹{order.subtotal} + Delivery ₹{order.deliveryFee}
                            </span>
                          </div>
                        </div>

                        {/* Send Prep Time + Cost + Generate Payment QR Button */}
                        <button
                          type="button"
                          onClick={() => {
                            canteenOwnerSendQuoteAndQr(order.id, draft.prepMins, draft.cost);
                            setSelectedStudentOrderId(order.id);
                          }}
                          className="btn-ocean-primary w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-[#008F7A] to-[#14B8A6] hover:opacity-95 font-display text-xs font-bold shadow-md flex items-center justify-center gap-2 transition-all cursor-pointer"
                        >
                          <QrCode className="h-4 w-4" />
                          <span>
                            {order.status === 'Pending Owner Quote'
                              ? `Accept & Send ${draft.prepMins}m Prep + ₹${draft.cost} Payment QR`
                              : `Update Quote (${draft.prepMins}m • ₹${draft.cost}) & Refresh QR`}
                          </span>
                        </button>
                      </div>

                      {/* Kitchen Progression Controls once quote/payment is active */}
                      {order.status !== 'Pending Owner Quote' && (
                        <div className="mt-3 pt-2.5 border-t border-teal-600/15 flex flex-wrap items-center justify-between gap-2">
                          <span className="text-[10px] font-mono font-semibold text-[#467874]">
                            Kitchen Status: <strong className="text-[#042f2e]">{order.status}</strong>
                          </span>
                          <div className="flex items-center gap-1.5">
                            <button
                              type="button"
                              onClick={() =>
                                updateCanteenOrderStatus(order.id, 'Paid & Preparing')
                              }
                              className="px-2.5 py-1 rounded-lg bg-teal-500/15 hover:bg-teal-500/25 text-[#007F6E] text-[10px] font-mono font-bold inline-flex items-center gap-1 cursor-pointer"
                            >
                              <Flame className="h-3 w-3" /> Preparing
                            </button>
                            <button
                              type="button"
                              onClick={() =>
                                updateCanteenOrderStatus(
                                  order.id,
                                  'Out for Classroom Delivery'
                                )
                              }
                              className="px-2.5 py-1 rounded-lg bg-teal-500/15 hover:bg-teal-500/25 text-[#007F6E] text-[10px] font-mono font-bold inline-flex items-center gap-1 cursor-pointer"
                            >
                              <Truck className="h-3 w-3" /> Dispatch to Class
                            </button>
                            <button
                              type="button"
                              onClick={() => updateCanteenOrderStatus(order.id, 'Delivered')}
                              className="px-2.5 py-1 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-800 text-[10px] font-mono font-bold inline-flex items-center gap-1 cursor-pointer"
                            >
                              <CheckCircle2 className="h-3 w-3" /> Delivered
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Owner Quick Stock Toggle for Selected Canteen */}
              <div className="mt-5 pt-4 border-t border-teal-600/15">
                <p className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#008F7A] mb-2">
                  QUICK MENU STOCK CONTROL ({selectedCanteen.toUpperCase()})
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {canteenMenu
                    .filter((m) => m.canteenName === selectedCanteen)
                    .map((m) => (
                      <button
                        key={m.id}
                        type="button"
                        onClick={() => toggleMenuItemAvailability(m.id)}
                        className={`px-2.5 py-1 rounded-lg text-[10px] font-mono font-semibold border transition-all cursor-pointer ${
                          m.available
                            ? 'bg-emerald-500/12 border-emerald-600/25 text-emerald-900'
                            : 'bg-rose-500/15 border-rose-600/30 text-rose-800 line-through'
                        }`}
                      >
                        {m.name.split(' ').slice(0, 3).join(' ')} (₹{m.price})
                      </button>
                    ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

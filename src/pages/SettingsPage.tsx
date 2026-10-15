import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Cpu,
  Server,
  Sliders,
  CheckCircle2,
  Shield,
  Sparkles,
  GraduationCap,
  LogIn,
  LogOut,
  DoorOpen,
  Building2,
  BookOpen,
  Clock,
  ArrowRight,
  UserCheck,
  Navigation,
  Box,
  History,
  KeyRound,
} from 'lucide-react';
import { GlassCard } from '../components/ui/GlassCard';
import { StatusIndicator } from '../components/ui/StatusIndicator';
import { useCampus } from '../context/CampusContext';

const SUBJECT_PRESETS = [
  'CS-401 Deep Reinforcement Learning • B.Tech AI & DS',
  'ENG-102 Quantum Mechanics & Photonics • B.E. ECE',
  'AERO-410 Autonomous Propulsion Lab • B.E. Aerospace',
  'BIO-480 Synthetic Gene Circuits • B.Tech Biotechnology',
  'QCS-501 Topological Computing • M.Tech CSE',
  'ECON-305 Venture Incubation Lab • MBA',
];

const TIMING_PRESETS = [
  '08:30 AM - 10:00 AM',
  '10:15 AM - 11:45 AM',
  '12:00 PM - 01:30 PM',
  '02:00 PM - 03:30 PM',
  '03:45 PM - 05:15 PM',
];

export const SettingsPage: React.FC = () => {
  const navigate = useNavigate();
  const {
    buildings,
    rooms,
    isFacultyLoggedIn,
    facultyProfile,
    loginFaculty,
    logoutFaculty,
    facultySessions,
    facultyCheckIn,
    facultyCheckOut,
    setSelectedBuildingId,
    setNavTo,
    setIsNavigating,
  } = useCampus();

  // System Config State
  const [apiEndpoint, setApiEndpoint] = useState('https://api.campusos.internal/v1');
  const [autoHvac, setAutoHvac] = useState(true);
  const [highFpsTwin, setHighFpsTwin] = useState(true);
  const [aiAutonomy, setAiAutonomy] = useState(true);
  const [saved, setSaved] = useState(false);

  // Faculty Login Modal / View Toggle
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [loginName, setLoginName] = useState(facultyProfile.name);
  const [loginCode, setLoginCode] = useState(facultyProfile.facultyCode);
  const [loginDept, setLoginDept] = useState(facultyProfile.department);
  const [loginPin, setLoginPin] = useState('2026');

  // Faculty Dashboard Form State (Room number, Block, Subject & Course, Timing)
  const [roomNumber, setRoomNumber] = useState('ROOM B204');
  const [blockId, setBlockId] = useState('block-12');
  const [subjectAndCourse, setSubjectAndCourse] = useState(
    'CS-401 Deep Reinforcement Learning • B.Tech AI & DS'
  );
  const [timing, setTiming] = useState('10:15 AM - 11:45 AM');
  const [actionBanner, setActionBanner] = useState<{
    type: 'in' | 'out';
    message: string;
  } | null>(null);

  const activeSession = facultySessions.find((s) => s.status === 'IN') || null;

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const handleFacultyLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    loginFaculty({
      name: loginName.trim() || 'Dr. R. Subramanian',
      facultyCode: loginCode.trim() || 'VISTAS-FAC-1042',
      department: loginDept.trim() || 'School of Computing & AI Engineering',
    });
    setShowLoginModal(false);
  };

  const handlePunchIn = () => {
    if (!roomNumber.trim() || !subjectAndCourse.trim() || !timing.trim()) return;
    const sess = facultyCheckIn({
      roomNumber,
      blockId,
      subjectAndCourse,
      timing,
    });
    setActionBanner({
      type: 'in',
      message: `CHECKED IN (IN): ${sess.roomNumber} • ${sess.blockName} • ${sess.subjectAndCourse} (${sess.timing}) at ${sess.inTime}`,
    });
    setTimeout(() => setActionBanner(null), 5000);
  };

  const handlePunchOut = (sessionId?: string) => {
    facultyCheckOut(sessionId);
    setActionBanner({
      type: 'out',
      message: `CHECKED OUT (OUT): Classroom session completed at ${new Date().toLocaleTimeString(
        [],
        { hour: '2-digit', minute: '2-digit' }
      )}. Smart AC set to ECO mode.`,
    });
    setTimeout(() => setActionBanner(null), 5000);
  };

  const handleViewBlockInTwin = (targetBlockId: string) => {
    setSelectedBuildingId(targetBlockId);
    navigate('/digital-twin');
  };

  const handleNavigateToBlock = (targetBlockId: string) => {
    setNavTo(targetBlockId);
    setIsNavigating(true);
    navigate('/digital-twin');
  };

  return (
    <div className="max-w-6xl space-y-6 pb-10">
      {/* Top Action Bar Inside Settings: Faculty Portal Login Trigger */}
      <GlassCard className="p-5 border-2 border-[#008F7A]/30">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-[#008F7A] to-[#14B8A6] text-white shadow-md">
              <GraduationCap className="h-6 w-6 !text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono font-bold uppercase tracking-[0.18em] text-[#008F7A]">
                  VISTAS FACULTY PORTAL
                </span>
                <StatusIndicator
                  status={isFacultyLoggedIn ? 'normal' : 'warning'}
                  label={isFacultyLoggedIn ? 'Faculty Logged In' : 'Authentication Ready'}
                  size="sm"
                />
              </div>
              <h2 className="font-display text-lg font-bold text-[#042f2e]">
                {isFacultyLoggedIn
                  ? `Faculty Dashboard — ${facultyProfile.name}`
                  : 'Faculty Classroom & Session Login'}
              </h2>
              <p className="text-xs text-[#467874]">
                {isFacultyLoggedIn
                  ? `${facultyProfile.facultyCode} • ${facultyProfile.department}`
                  : 'Sign in as Faculty to access the Faculty Dashboard with Room, Block, Subject & Course, Timing, and IN / OUT controls.'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            {!isFacultyLoggedIn ? (
              <button
                onClick={() => setShowLoginModal(true)}
                className="btn-ocean-primary inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-[#008F7A] to-[#14B8A6] hover:from-[#007F6E] hover:to-[#0D9488] !text-white font-bold text-xs shadow-lg transition-all cursor-pointer"
              >
                <LogIn className="h-4 w-4 !text-white" />
                <span>Faculty Login</span>
              </button>
            ) : (
              <button
                onClick={logoutFaculty}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-rose-500/12 hover:bg-rose-500/20 text-rose-700 border border-rose-500/30 font-bold text-xs transition-all cursor-pointer"
              >
                <LogOut className="h-4 w-4" />
                <span>Logout Faculty</span>
              </button>
            )}
          </div>
        </div>
      </GlassCard>

      {/* FACULTY LOGIN MODAL */}
      <AnimatePresence>
        {showLoginModal && !isFacultyLoggedIn && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-teal-950/40 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.94, y: 14 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.94, y: 14 }}
              transition={{ duration: 0.22 }}
              className="w-full max-w-md rounded-2xl bg-white/98 backdrop-blur-2xl border-2 border-[#008F7A]/40 shadow-[0_24px_60px_rgba(0,143,122,0.32)] p-6"
            >
              <div className="flex items-center gap-3 pb-4 border-b border-teal-500/15">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#008F7A] !text-white">
                  <KeyRound className="h-5 w-5 !text-white" />
                </div>
                <div>
                  <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-[#008F7A]">
                    CAMPUSOS AUTHENTICATION
                  </span>
                  <h3 className="font-display text-lg font-bold text-[#042f2e]">
                    Faculty Portal Login
                  </h3>
                </div>
              </div>

              <form onSubmit={handleFacultyLoginSubmit} className="mt-4 space-y-3.5">
                <div>
                  <label className="block text-[10px] font-mono font-bold uppercase tracking-wider text-[#467874] mb-1">
                    Faculty Name
                  </label>
                  <input
                    type="text"
                    value={loginName}
                    onChange={(e) => setLoginName(e.target.value)}
                    placeholder="e.g. Dr. R. Subramanian"
                    className="w-full rounded-xl bg-[#EBF9F6] border border-teal-500/30 px-3.5 py-2.5 text-xs font-semibold text-[#042f2e] focus:border-[#008F7A] focus:outline-none"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10px] font-mono font-bold uppercase tracking-wider text-[#467874] mb-1">
                      Faculty ID Code
                    </label>
                    <input
                      type="text"
                      value={loginCode}
                      onChange={(e) => setLoginCode(e.target.value)}
                      placeholder="VISTAS-FAC-1042"
                      className="w-full rounded-xl bg-[#EBF9F6] border border-teal-500/30 px-3.5 py-2.5 text-xs font-mono font-semibold text-[#042f2e] focus:border-[#008F7A] focus:outline-none"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-mono font-bold uppercase tracking-wider text-[#467874] mb-1">
                      Access PIN
                    </label>
                    <input
                      type="password"
                      value={loginPin}
                      onChange={(e) => setLoginPin(e.target.value)}
                      className="w-full rounded-xl bg-[#EBF9F6] border border-teal-500/30 px-3.5 py-2.5 text-xs font-mono font-semibold text-[#042f2e] focus:border-[#008F7A] focus:outline-none"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-mono font-bold uppercase tracking-wider text-[#467874] mb-1">
                    Department / School
                  </label>
                  <input
                    type="text"
                    value={loginDept}
                    onChange={(e) => setLoginDept(e.target.value)}
                    className="w-full rounded-xl bg-[#EBF9F6] border border-teal-500/30 px-3.5 py-2.5 text-xs font-semibold text-[#042f2e] focus:border-[#008F7A] focus:outline-none"
                  />
                </div>

                <div className="pt-3 flex items-center justify-end gap-2.5">
                  <button
                    type="button"
                    onClick={() => setShowLoginModal(false)}
                    className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-xs font-semibold text-slate-700"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn-ocean-primary inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#008F7A] to-[#14B8A6] !text-white font-bold text-xs shadow-md"
                  >
                    <LogIn className="h-4 w-4 !text-white" />
                    <span>Open Faculty Dashboard</span>
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ===================================================================== */}
      {/* NEW FACULTY DASHBOARD (Appears when Faculty logs in)                  */}
      {/* ===================================================================== */}
      <AnimatePresence>
        {isFacultyLoggedIn && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.3 }}
            className="space-y-6"
          >
            {/* Live Feedback Banner on IN / OUT Click */}
            {actionBanner && (
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                className={`p-4 rounded-2xl border-2 flex items-center justify-between shadow-md ${
                  actionBanner.type === 'in'
                    ? 'bg-emerald-50 border-emerald-500/50 text-emerald-900'
                    : 'bg-rose-50 border-rose-500/50 text-rose-900'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span
                    className={`px-2.5 py-1 rounded-lg font-mono text-xs font-extrabold !text-white ${
                      actionBanner.type === 'in' ? 'bg-[#008F7A]' : 'bg-rose-600'
                    }`}
                  >
                    {actionBanner.type === 'in' ? 'IN CONFIRMED' : 'OUT CONFIRMED'}
                  </span>
                  <span className="text-xs font-bold">{actionBanner.message}</span>
                </div>
              </motion.div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* LEFT 7 COLS: FACULTY SESSION CHECK-IN / CHECK-OUT FORM */}
              <GlassCard className="lg:col-span-7 p-6 border-2 border-[#008F7A]/35">
                <div className="flex items-center justify-between pb-4 border-b border-teal-500/20">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-xl bg-teal-500/15 border border-teal-500/30 text-[#008F7A]">
                      <UserCheck className="h-5 w-5" />
                    </div>
                    <div>
                      <span className="text-[10px] font-mono font-bold uppercase tracking-[0.16em] text-[#008F7A]">
                        FACULTY SMART CLASSROOM CONSOLE
                      </span>
                      <h3 className="font-display text-lg font-bold text-[#042f2e]">
                        Class Session Entry & Attendance Control
                      </h3>
                    </div>
                  </div>
                  <span className="px-3 py-1 rounded-full bg-[#EBF9F6] border border-teal-500/30 text-[11px] font-mono font-bold text-[#007F6E]">
                    {facultyProfile.facultyCode}
                  </span>
                </div>

                {/* Required 4 Fields: Room Number, Block, Subject & Course, Timing */}
                <div className="mt-5 space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* 1. ROOM NUMBER FIELD */}
                    <div>
                      <label className="flex items-center gap-1.5 text-xs font-mono font-bold uppercase tracking-wider text-[#042f2e] mb-1.5">
                        <DoorOpen className="h-3.5 w-3.5 text-[#008F7A]" />
                        1. Room Number
                      </label>
                      <input
                        type="text"
                        value={roomNumber}
                        onChange={(e) => setRoomNumber(e.target.value)}
                        placeholder="Enter Room Number (e.g. ROOM B204)"
                        className="w-full rounded-xl bg-white border-2 border-teal-500/35 px-3.5 py-2.5 text-xs font-bold text-[#042f2e] focus:border-[#008F7A] focus:outline-none shadow-2xs"
                      />
                      {/* Quick Room Pills */}
                      <div className="mt-2 flex flex-wrap gap-1.5">
                        {rooms.slice(0, 5).map((r) => (
                          <button
                            key={r.id}
                            type="button"
                            onClick={() => {
                              setRoomNumber(r.code);
                              setBlockId(r.buildingId);
                            }}
                            className={`px-2 py-0.5 rounded-md text-[10px] font-mono font-semibold border transition-all ${
                              roomNumber.toUpperCase() === r.code
                                ? 'bg-[#008F7A] !text-white border-[#008F7A]'
                                : 'bg-[#EBF9F6] text-[#007F6E] border-teal-500/25 hover:border-[#008F7A]'
                            }`}
                          >
                            {r.code}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* 2. BLOCK FIELD */}
                    <div>
                      <label className="flex items-center gap-1.5 text-xs font-mono font-bold uppercase tracking-wider text-[#042f2e] mb-1.5">
                        <Building2 className="h-3.5 w-3.5 text-[#008F7A]" />
                        2. Block (VISTAS 1–30)
                      </label>
                      <select
                        value={blockId}
                        onChange={(e) => setBlockId(e.target.value)}
                        className="w-full rounded-xl bg-white border-2 border-teal-500/35 px-3.5 py-2.5 text-xs font-bold text-[#042f2e] focus:border-[#008F7A] focus:outline-none shadow-2xs"
                      >
                        {buildings.map((b) => {
                          const num = b.id.replace('block-', '');
                          return (
                            <option key={b.id} value={b.id}>
                              {num}. {b.name}
                            </option>
                          );
                        })}
                      </select>
                      <p className="text-[10px] text-[#467874] mt-1.5 font-mono">
                        Synced with 3D Digital Twin Block Architecture
                      </p>
                    </div>
                  </div>

                  {/* 3. SUBJECT AND COURSE FIELD */}
                  <div>
                    <label className="flex items-center gap-1.5 text-xs font-mono font-bold uppercase tracking-wider text-[#042f2e] mb-1.5">
                      <BookOpen className="h-3.5 w-3.5 text-[#008F7A]" />
                      3. Subject and Course
                    </label>
                    <input
                      type="text"
                      value={subjectAndCourse}
                      onChange={(e) => setSubjectAndCourse(e.target.value)}
                      placeholder="Enter Subject Code, Title & Course (e.g. CS-401 Deep Learning • B.Tech CSE)"
                      className="w-full rounded-xl bg-white border-2 border-teal-500/35 px-3.5 py-2.5 text-xs font-bold text-[#042f2e] focus:border-[#008F7A] focus:outline-none shadow-2xs"
                    />
                    <div className="mt-2 flex flex-wrap gap-1.5">
                      {SUBJECT_PRESETS.slice(0, 3).map((subj) => (
                        <button
                          key={subj}
                          type="button"
                          onClick={() => setSubjectAndCourse(subj)}
                          className={`px-2.5 py-1 rounded-lg text-[10px] font-medium border transition-all truncate max-w-full ${
                            subjectAndCourse === subj
                              ? 'bg-[#008F7A] !text-white border-[#008F7A]'
                              : 'bg-[#EBF9F6] text-[#1f5754] border-teal-500/25 hover:border-[#008F7A]'
                          }`}
                        >
                          {subj}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* 4. TIMING FIELD */}
                  <div>
                    <label className="flex items-center gap-1.5 text-xs font-mono font-bold uppercase tracking-wider text-[#042f2e] mb-1.5">
                      <Clock className="h-3.5 w-3.5 text-[#008F7A]" />
                      4. Timing
                    </label>
                    <input
                      type="text"
                      value={timing}
                      onChange={(e) => setTiming(e.target.value)}
                      placeholder="e.g. 10:15 AM - 11:45 AM"
                      className="w-full rounded-xl bg-white border-2 border-teal-500/35 px-3.5 py-2.5 text-xs font-bold text-[#042f2e] focus:border-[#008F7A] focus:outline-none shadow-2xs"
                    />
                    <div className="mt-2 flex flex-wrap gap-1.5">
                      {TIMING_PRESETS.map((slot) => (
                        <button
                          key={slot}
                          type="button"
                          onClick={() => setTiming(slot)}
                          className={`px-2.5 py-1 rounded-lg text-[10px] font-mono font-semibold border transition-all ${
                            timing === slot
                              ? 'bg-[#008F7A] !text-white border-[#008F7A]'
                              : 'bg-[#EBF9F6] text-[#007F6E] border-teal-500/25 hover:border-[#008F7A]'
                          }`}
                        >
                          {slot}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* 5. IN AND OUT BUTTONS */}
                  <div className="pt-4 border-t border-teal-500/20">
                    <span className="block text-[10px] font-mono font-bold uppercase tracking-wider text-[#467874] mb-2.5">
                      5. Faculty Session Attendance Controls (IN / OUT)
                    </span>
                    <div className="grid grid-cols-2 gap-4">
                      {/* IN BUTTON */}
                      <button
                        type="button"
                        onClick={handlePunchIn}
                        className="flex items-center justify-center gap-2.5 py-3.5 px-5 rounded-2xl bg-gradient-to-r from-[#008F7A] to-[#10B981] hover:from-[#007F6E] hover:to-[#059669] !text-white font-display font-bold text-sm shadow-[0_10px_25px_rgba(0,143,122,0.35)] hover:scale-[1.01] active:scale-[0.99] transition-all cursor-pointer"
                      >
                        <LogIn className="h-5 w-5 !text-white" />
                        <span>IN (Start Session)</span>
                      </button>

                      {/* OUT BUTTON */}
                      <button
                        type="button"
                        onClick={() => handlePunchOut()}
                        className="flex items-center justify-center gap-2.5 py-3.5 px-5 rounded-2xl bg-gradient-to-r from-rose-600 to-red-500 hover:from-rose-700 hover:to-red-600 !text-white font-display font-bold text-sm shadow-[0_10px_25px_rgba(225,29,72,0.3)] hover:scale-[1.01] active:scale-[0.99] transition-all cursor-pointer"
                      >
                        <LogOut className="h-5 w-5 !text-white" />
                        <span>OUT (End Session)</span>
                      </button>
                    </div>
                  </div>
                </div>
              </GlassCard>

              {/* RIGHT 5 COLS: CURRENT ACTIVE SESSION STATUS & 3D TWIN INTEGRATION */}
              <div className="lg:col-span-5 space-y-6">
                <GlassCard className="p-6 border-2 border-teal-500/30">
                  <div className="flex items-center justify-between pb-3.5 border-b border-teal-500/15">
                    <span className="text-[10px] font-mono font-bold uppercase tracking-[0.16em] text-[#008F7A]">
                      LIVE FACULTY STATUS
                    </span>
                    <StatusIndicator
                      status={activeSession ? 'normal' : 'warning'}
                      label={activeSession ? 'CURRENTLY IN CLASS (IN)' : 'CHECKED OUT (OUT)'}
                      size="sm"
                    />
                  </div>

                  {activeSession ? (
                    <div className="mt-4 space-y-4">
                      <div className="p-4 rounded-2xl bg-[#EBF9F6] border border-teal-500/30 space-y-2.5">
                        <div className="flex items-center justify-between">
                          <span className="px-2.5 py-0.5 rounded-full bg-[#008F7A] !text-white text-[10px] font-mono font-bold">
                            STATUS: IN
                          </span>
                          <span className="text-xs font-mono font-bold text-[#007F6E]">
                            Checked In at {activeSession.inTime}
                          </span>
                        </div>
                        <div className="pt-1">
                          <p className="text-[11px] font-mono uppercase text-[#467874]">
                            Room & Block
                          </p>
                          <p className="font-display text-lg font-bold text-[#042f2e]">
                            {activeSession.roomNumber} • {activeSession.blockName}
                          </p>
                        </div>
                        <div>
                          <p className="text-[11px] font-mono uppercase text-[#467874]">
                            Subject & Course
                          </p>
                          <p className="text-xs font-bold text-[#007F6E]">
                            {activeSession.subjectAndCourse}
                          </p>
                        </div>
                        <div>
                          <p className="text-[11px] font-mono uppercase text-[#467874]">
                            Scheduled Timing
                          </p>
                          <p className="text-xs font-mono font-bold text-[#042f2e]">
                            {activeSession.timing}
                          </p>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-2.5">
                        <button
                          type="button"
                          onClick={() => handleViewBlockInTwin(activeSession.blockId)}
                          className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-[#EBF9F6] hover:bg-teal-500/20 text-[#042f2e] border border-teal-500/30 text-xs font-bold transition-all"
                        >
                          <Box className="h-3.5 w-3.5 text-[#008F7A]" />
                          <span>Inspect 3D Block</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => handleNavigateToBlock(activeSession.blockId)}
                          className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-[#1A73E8] hover:bg-[#1557B0] !text-white text-xs font-bold shadow-sm transition-all"
                        >
                          <Navigation className="h-3.5 w-3.5 !text-white" />
                          <span>Google Maps Route</span>
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="mt-4 p-6 rounded-2xl bg-[#F2FBF9] border border-teal-500/20 text-center space-y-2">
                      <p className="text-sm font-bold text-[#042f2e]">
                        No Active Classroom Session
                      </p>
                      <p className="text-xs text-[#467874]">
                        Fill in the Room Number, Block, Subject & Course, and Timing on the left and click <strong>IN (Start Session)</strong>.
                      </p>
                    </div>
                  )}
                </GlassCard>

                {/* Quick Link to Smart Classrooms */}
                <GlassCard className="p-5">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs font-bold text-[#042f2e]">
                        Smart Classroom Automation Sync
                      </p>
                      <p className="text-[11px] text-[#467874]">
                        Clicking IN turns room AC ON & marks room OCCUPIED. Clicking OUT sets room AVAILABLE.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => navigate('/classrooms')}
                      className="p-2.5 rounded-xl bg-[#EBF9F6] hover:bg-teal-500/20 text-[#008F7A] border border-teal-500/25"
                    >
                      <ArrowRight className="h-4 w-4" />
                    </button>
                  </div>
                </GlassCard>
              </div>
            </div>

            {/* FACULTY SESSION & ATTENDANCE LOG TABLE */}
            <GlassCard className="p-6">
              <div className="flex items-center justify-between pb-4 border-b border-teal-500/15">
                <div className="flex items-center gap-2.5">
                  <History className="h-5 w-5 text-[#008F7A]" />
                  <div>
                    <h3 className="font-display text-base font-bold text-[#042f2e]">
                      Faculty Classroom IN / OUT Session Log
                    </h3>
                    <p className="text-xs text-[#467874]">
                      Real-time log of Faculty Room Number, Block, Subject & Course, Timing, and IN/OUT timestamps
                    </p>
                  </div>
                </div>
                <span className="text-xs font-mono font-bold text-[#007F6E]">
                  {facultySessions.length} Sessions Recorded
                </span>
              </div>

              <div className="mt-4 overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-teal-500/20 text-[10px] font-mono uppercase tracking-wider text-[#467874]">
                      <th className="py-2.5 px-3">Room Number</th>
                      <th className="py-2.5 px-3">Block</th>
                      <th className="py-2.5 px-3">Subject & Course</th>
                      <th className="py-2.5 px-3">Timing</th>
                      <th className="py-2.5 px-3">IN Time</th>
                      <th className="py-2.5 px-3">OUT Time</th>
                      <th className="py-2.5 px-3">Status / Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-teal-500/10 text-xs">
                    {facultySessions.map((sess) => (
                      <tr key={sess.id} className="hover:bg-teal-500/5 transition-colors">
                        <td className="py-3 px-3 font-mono font-bold text-[#042f2e]">
                          {sess.roomNumber}
                        </td>
                        <td className="py-3 px-3 font-semibold text-[#007F6E]">
                          {sess.blockName}
                        </td>
                        <td className="py-3 px-3 font-medium text-[#042f2e]">
                          {sess.subjectAndCourse}
                        </td>
                        <td className="py-3 px-3 font-mono text-[#467874]">
                          {sess.timing}
                        </td>
                        <td className="py-3 px-3 font-mono font-bold text-emerald-700">
                          {sess.inTime}
                        </td>
                        <td className="py-3 px-3 font-mono font-bold text-rose-600">
                          {sess.outTime || '—'}
                        </td>
                        <td className="py-3 px-3">
                          {sess.status === 'IN' ? (
                            <div className="flex items-center gap-2">
                              <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-800 border border-emerald-500/30 text-[10px] font-mono font-bold">
                                ● IN SESSION
                              </span>
                              <button
                                type="button"
                                onClick={() => handlePunchOut(sess.id)}
                                className="px-2.5 py-1 rounded-lg bg-rose-600 hover:bg-rose-700 !text-white text-[10px] font-mono font-bold shadow-2xs cursor-pointer"
                              >
                                Mark OUT
                              </button>
                            </div>
                          ) : (
                            <span className="px-2.5 py-0.5 rounded-full bg-slate-200/70 text-slate-700 text-[10px] font-mono font-bold">
                              CHECKED OUT
                            </span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </GlassCard>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ===================================================================== */}
      {/* EXISTING SYSTEM KERNEL & DIGITAL TWIN CONFIGURATION                   */}
      {/* ===================================================================== */}
      <GlassCard className="p-6">
        <div className="flex items-center justify-between pb-4 border-b border-teal-500/15">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-teal-500/15 border border-teal-500/30 text-[#008F7A]">
              <Cpu className="h-5 w-5" />
            </div>
            <div>
              <h2 className="font-display text-lg font-bold text-[#042f2e]">
                CAMPUSOS Kernel & Digital Twin Configuration
              </h2>
              <p className="text-xs text-[#467874]">
                Modular architecture ready for FastAPI backend integration
              </p>
            </div>
          </div>
          <StatusIndicator status="normal" label="Kernel v4.2 Online" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          {/* FastAPI Backend Bridge Config */}
          <div className="space-y-4">
            <h3 className="text-xs font-mono uppercase tracking-wider text-[#008F7A] flex items-center gap-2">
              <Server className="h-4 w-4" />
              FastAPI Telemetry Bridge
            </h3>

            <div>
              <label className="block text-xs text-[#1f5754] mb-1.5">
                REST / WebSocket Endpoint URL
              </label>
              <input
                type="text"
                value={apiEndpoint}
                onChange={(e) => setApiEndpoint(e.target.value)}
                className="w-full rounded-xl bg-[#EBF9F6] border border-teal-500/25 px-3.5 py-2.5 text-xs font-mono text-[#007F6E] focus:border-[#008F7A] focus:outline-none"
              />
              <p className="text-[11px] text-[#467874] mt-1">
                Currently operating in high-speed deterministic Mock Telemetry Mode.
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-[#EBF9F6] border border-teal-500/20 space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-[#467874]">Data Separation Layer</span>
                <span className="font-mono text-emerald-700 font-semibold">campusData.ts ✓</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#467874]">WebSocket Stream Ready</span>
                <span className="font-mono text-[#007F6E]">ws://.../telemetry</span>
              </div>
            </div>
          </div>

          {/* Autonomous Controls */}
          <div className="space-y-3">
            <h3 className="text-xs font-mono uppercase tracking-wider text-[#008F7A] flex items-center gap-2">
              <Sliders className="h-4 w-4" />
              Digital Twin & AI Autonomy
            </h3>

            <label className="flex items-center justify-between p-3.5 rounded-xl bg-[#EBF9F6] border border-teal-500/20 cursor-pointer">
              <div>
                <p className="text-xs font-semibold text-[#042f2e]">
                  Autonomous HVAC Eco-Throttling
                </p>
                <p className="text-[11px] text-[#467874]">
                  Automatically dim AC in unoccupied classrooms
                </p>
              </div>
              <input
                type="checkbox"
                checked={autoHvac}
                onChange={(e) => setAutoHvac(e.target.checked)}
                className="h-4 w-4 accent-[#008F7A]"
              />
            </label>

            <label className="flex items-center justify-between p-3.5 rounded-xl bg-[#EBF9F6] border border-teal-500/20 cursor-pointer">
              <div>
                <p className="text-xs font-semibold text-[#042f2e]">
                  60 FPS WebGL Shadow & Reflection Pipeline
                </p>
                <p className="text-[11px] text-[#467874]">
                  Real-time directional shadows in 3D Digital Twin
                </p>
              </div>
              <input
                type="checkbox"
                checked={highFpsTwin}
                onChange={(e) => setHighFpsTwin(e.target.checked)}
                className="h-4 w-4 accent-[#008F7A]"
              />
            </label>

            <label className="flex items-center justify-between p-3.5 rounded-xl bg-[#EBF9F6] border border-teal-500/20 cursor-pointer">
              <div>
                <p className="text-xs font-semibold text-[#042f2e] flex items-center gap-1.5">
                  <Sparkles className="h-3.5 w-3.5 text-[#008F7A]" />
                  Predictive Maintenance Auto-Triage
                </p>
                <p className="text-[11px] text-[#467874]">
                  Classify incoming tickets with Campus AI Neural v4
                </p>
              </div>
              <input
                type="checkbox"
                checked={aiAutonomy}
                onChange={(e) => setAiAutonomy(e.target.checked)}
                className="h-4 w-4 accent-[#008F7A]"
              />
            </label>
          </div>
        </div>

        <div className="mt-6 pt-4 border-t border-teal-500/15 flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs text-[#467874]">
            <Shield className="h-4 w-4 text-[#008F7A]" />
            <span>Zero-Trust Campus Role: Chief Campus Officer</span>
          </div>
          <button
            onClick={handleSave}
            className="btn-ocean-primary inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#008F7A] to-[#14B8A6] font-bold text-xs shadow-md"
          >
            <CheckCircle2 className="h-4 w-4 text-white" />
            <span>{saved ? 'Configuration Saved ✓' : 'Apply System Configuration'}</span>
          </button>
        </div>
      </GlassCard>
    </div>
  );
};

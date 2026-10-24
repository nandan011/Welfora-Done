export function parseDemoDeadline(value) {
  const match = String(value || '').match(/^(\d{1,2})\s+([A-Za-z]{3})\s+(\d{4})$/);
  if (!match) return null;
  const months = { Jan: 0, Feb: 1, Mar: 2, Apr: 3, May: 4, Jun: 5, Jul: 6, Aug: 7, Sep: 8, Oct: 9, Nov: 10, Dec: 11 };
  if (!(match[2] in months)) return null;
  const date = new Date(Number(match[3]), months[match[2]], Number(match[1]));
  return Number.isNaN(date.getTime()) ? null : date;
}

export function formatDaysRemaining(date) {
  const today = new Date(); today.setHours(0, 0, 0, 0);
  const target = new Date(date); target.setHours(0, 0, 0, 0);
  const days = Math.ceil((target - today) / 86400000);
  if (days < 0) return 'Past date · verify status';
  if (days === 0) return 'Today · verify officially';
  if (days === 1) return '1 day left · demo date';
  return `${days} days left · demo date`;
}

// Transparent demo matching rules: these suggest what to review, never confirm official eligibility.
export function assessSchemeFit(scheme, profile) {
  let score = 42;
  const reasons = [];
  const occupation = String(profile.occupation || '').toLowerCase();
  const income = Number(profile.income);
  if (occupation === 'student' && scheme.category === 'Education') {
    score += 38; reasons.push('Your occupation is Student and this is an education-related scheme.');
  }
  if (occupation === 'farmer' && scheme.category === 'Agriculture') {
    score += 42; reasons.push('Your occupation is Farmer and this scheme covers agriculture support.');
  }
  if (Number.isFinite(income) && income <= 300000 && ['Financial Aid', 'Housing', 'Essential Services'].includes(scheme.category)) {
    score += 20; reasons.push('Your stated household income makes this support category worth checking.');
  }
  if (scheme.state === 'All India') {
    score += 8; reasons.push('The demo record indicates nationwide coverage.');
  } else if (scheme.state === 'State dependent' || scheme.state === 'Participating states') {
    score += 3; reasons.push(`You selected ${profile.state || 'your state'}; availability depends on local implementation and current rules.`);
  }
  if (!reasons.length) reasons.push('Review the official criteria to see whether your circumstances fit.');
  return { score: Math.min(98, score), reasons };
}

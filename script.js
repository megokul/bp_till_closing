function getSafeDropBreakdown(amount, notes, coins) {
  const breakdown = [];
  const allDenoms = [
    ...notes.map(n => ({
      denom: parseFloat(n.label.replace("£", "")),
      label: n.label,
      count: n.count
    })),
    ...coins.map(c => ({
      denom: parseFloat(c.label.replace("£", "").replace("p", "")) / (c.label.includes("p") ? 100 : 1),
      label: c.label,
      count: c.count
    }))
  ].sort((a, b) => b.denom - a.denom);

  let remaining = amount;

  for (const d of allDenoms) {
    const needed = Math.floor(remaining / d.denom);
    const used = Math.min(needed, d.count);
    if (used > 0) {
      breakdown.push({ label: d.label, count: used, value: +(used * d.denom).toFixed(2) });
      remaining -= used * d.denom;
      remaining = +remaining.toFixed(2);
    }
    if (remaining === 0) break;
  }

  return { breakdown, leftover: remaining };
}

function getTimestampedFilename() {
  const now = new Date();
  const iso = now.toISOString().replace(/[:.]/g, "-"); // e.g., 2025-06-26T14-22-01-123Z
  return `closing_${iso}.png`;
}

document.getElementById('tillForm').addEventListener('submit', function(event) {
  event.preventDefault();

  const fiftyCount = parseFloat(document.getElementById('fifty').value) || 0;
  const twentyCount = parseFloat(document.getElementById('twenty').value) || 0;
  const tenCount = parseFloat(document.getElementById('ten').value) || 0;
  const fiveCount = parseFloat(document.getElementById('five').value) || 0;

  const twoPoundWeight = parseFloat(document.getElementById('twoPound').value) || 0;
  const onePoundWeight = parseFloat(document.getElementById('onePound').value) || 0;
  const fiftyPWeight = parseFloat(document.getElementById('fiftyP').value) || 0;
  const twentyPWeight = parseFloat(document.getElementById('twentyP').value) || 0;
  const tenPWeight = parseFloat(document.getElementById('tenP').value) || 0;
  const fivePWeight = parseFloat(document.getElementById('fiveP').value) || 0;
  const twoPWeight = parseFloat(document.getElementById('twoP').value) || 0;
  const onePWeight = parseFloat(document.getElementById('oneP').value) || 0;

  const extraCash = parseFloat(document.getElementById('extraCash').value) || 0;
  const floatAmount = parseFloat(document.getElementById('floatAmount').value) || 0;

  const avg = {
    twoPound: 12.00,
    onePound: 8.75,
    fiftyP: 8.00,
    twentyP: 5.00,
    tenP: 6.50,
    fiveP: 3.25,
    twoP: 7.12,
    oneP: 3.56
  };

  const notes = [
    { label: '£50', count: fiftyCount, value: fiftyCount * 50 },
    { label: '£20', count: twentyCount, value: twentyCount * 20 },
    { label: '£10', count: tenCount, value: tenCount * 10 },
    { label: '£5', count: fiveCount, value: fiveCount * 5 }
  ];
  const notesTotal = notes.reduce((sum, n) => sum + n.value, 0);

  const coins = [
    { label: '£2', weight: twoPoundWeight, avg: avg.twoPound, denom: 2 },
    { label: '£1', weight: onePoundWeight, avg: avg.onePound, denom: 1 },
    { label: '50p', weight: fiftyPWeight, avg: avg.fiftyP, denom: 0.5 },
    { label: '20p', weight: twentyPWeight, avg: avg.twentyP, denom: 0.2 },
    { label: '10p', weight: tenPWeight, avg: avg.tenP, denom: 0.1 },
    { label: '5p', weight: fivePWeight, avg: avg.fiveP, denom: 0.05 },
    { label: '2p', weight: twoPWeight, avg: avg.twoP, denom: 0.02 },
    { label: '1p', weight: onePWeight, avg: avg.oneP, denom: 0.01 }
  ].map(c => {
    const coinsCount = Math.round(c.weight / c.avg);
    return {
      label: c.label,
      count: coinsCount,
      value: +(coinsCount * c.denom).toFixed(2)
    };
  });
  const coinsTotal = coins.reduce((sum, c) => sum + c.value, 0);

  const totalCash = notesTotal + coinsTotal + extraCash;
  const safeDrop = totalCash - floatAmount;

  let html = '<h2>Results</h2>';

  html += '<h3>Notes Breakdown</h3>';
  html += '<table class="breakdown"><thead><tr><th>Denomination</th><th>Count</th><th>Value (£)</th></tr></thead><tbody>';
  notes.forEach(n => {
    html += `<tr><td>${n.label}</td><td>${n.count}</td><td>${n.value.toFixed(2)}</td></tr>`;
  });
  html += `<tr class="totals"><td colspan="2">Total Notes</td><td>£${notesTotal.toFixed(2)}</td></tr>`;
  html += '</tbody></table>';

  html += '<h3>Coins Breakdown</h3>';
  html += '<table class="breakdown"><thead><tr><th>Denomination</th><th>Count</th><th>Value (£)</th></tr></thead><tbody>';
  coins.forEach(c => {
    html += `<tr><td>${c.label}</td><td>${c.count}</td><td>${c.value.toFixed(2)}</td></tr>`;
  });
  html += `<tr class="totals"><td colspan="2">Total Coins</td><td>£${coinsTotal.toFixed(2)}</td></tr>`;
  html += '</tbody></table>';

  html += '<h3>Extra Cash Breakdown</h3>';
  html += '<table class="breakdown"><thead><tr><th>Description</th><th>Value (£)</th></tr></thead><tbody>';
  html += `<tr><td>Extra Cash Entered</td><td>${extraCash.toFixed(2)}</td></tr>`;
  html += '</tbody></table>';

  html += '<div class="summary">';
  html += `<div class="item"><span>Combined Cash:</span> <span class="highlight">£${totalCash.toFixed(2)}</span></div>`;
  html += `<div class="item"><span>Float Amount:</span> <span>£${floatAmount.toFixed(2)}</span></div>`;
  html += `<div class="item"><span>Safe Drop:</span> <span class="highlight">£${safeDrop.toFixed(2)}</span></div>`;
  html += '</div>';

  const { breakdown: safeDropBreakdown, leftover: safeDropLeftover } = getSafeDropBreakdown(safeDrop, notes, coins);

  html += '<h3>Safe Drop Breakdown</h3>';
  html += '<table class="breakdown"><thead><tr><th>Denomination</th><th>Count</th><th>Value (£)</th></tr></thead><tbody>';
  safeDropBreakdown.forEach(item => {
    html += `<tr><td>${item.label}</td><td>${item.count}</td><td>${item.value.toFixed(2)}</td></tr>`;
  });
  const totalDropValue = safeDropBreakdown.reduce((sum, i) => sum + i.value, 0);
  html += `<tr class="totals"><td colspan="2">Total Used</td><td>£${totalDropValue.toFixed(2)}</td></tr>`;
  html += '</tbody></table>';

  if (safeDropLeftover > 0) {
    html += `<div class="warning" style="color: red; font-weight: bold; margin-top: 10px;">
      Warning: Unable to fully split the safe drop amount. <br/>
      Remaining unallocated: £${safeDropLeftover.toFixed(2)}
    </div>`;
  }

  document.getElementById('results').innerHTML = html;

  const btn = document.getElementById('downloadImage');
  btn.style.display = 'inline-block';
  btn.onclick = function () {
    html2canvas(document.getElementById('results')).then(canvas => {
      const link = document.createElement('a');
      link.download = getTimestampedFilename();
      link.href = canvas.toDataURL('image/png');
      link.click();
    });
  };
});

document.getElementById('tillForm').addEventListener('reset', function(event) {
  document.getElementById('results').innerHTML = '';
  document.getElementById('downloadImage').style.display = 'none';
});

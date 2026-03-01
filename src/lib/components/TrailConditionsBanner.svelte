<script lang="ts">
  const conditions = [
    { trail: 'Woven Wire', status: 'open', note: 'Open' },
    { trail: 'Pine Knob', status: 'closed', note: 'Closed - wet conditions' },
  ];

  const icons: Record<string, string> = {
    open: '🟢',
    closed: '🔴',
    caution: '🟡',
  };

  const text = conditions
    .map(c => `${icons[c.status]} ${c.trail}${c.note ? ` – ${c.note}` : ''}`)
    .join('   |   ');
</script>

<div class="bg-green-900 text-white text-sm py-1.5 text-center">
  <span>{text}</span>
</div>


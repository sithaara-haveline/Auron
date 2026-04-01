export function groupBySemester(milestones: any[]) {
  const grouped: any = {}

  milestones.forEach(m => {
    const d = new Date(m.due_date)
    const sem = d.getMonth() < 6
      ? `Jan - May ${d.getFullYear()}`
      : `Aug - Dec ${d.getFullYear()}`

    if (!grouped[sem]) grouped[sem] = []
    grouped[sem].push(m)
  })

  return Object.entries(grouped).map(([semester, milestones]) => ({
    semester,
    milestones
  }))
}
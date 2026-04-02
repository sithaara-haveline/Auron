export function groupBySemester(milestones: any[]) {
  const grouped: any = {}

  milestones.forEach((m) => {
    const date = new Date(m.due_date)
    const year = date.getFullYear()
    const month = date.getMonth()

    const semester =
      month < 6
        ? `Jan - May ${year}`
        : `Aug - Dec ${year}`

    if (!grouped[semester]) {
      grouped[semester] = []
    }

    grouped[semester].push(m)
  })

  return Object.entries(grouped).map(([semester, milestones]) => ({
    semester,
    milestones
  }))
}
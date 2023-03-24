const stats = [
  { name: 'Total Subscribers', stat: '71,897' },
  { name: 'Avg. Open Rate', stat: '58.16%' },
  { name: 'Avg. Click Rate', stat: '24.57%' },
]

function Number(props) {
  const { item } = props;
  const { name, stat } = item;
  return (
    <div key={name} className="border border-gray-200 overflow-hidden rounded-lg bg-white px-4 py-5 shadow sm:p-6">
      <dt className="truncate text-sm font-medium text-gray-500">{name}</dt>
      <dd className="mt-1 text-3xl font-semibold tracking-tight text-gray-900">{stat}</dd>
    </div>
  )
}

Number.defaultProps = {
  item: {}
}

export default Number;
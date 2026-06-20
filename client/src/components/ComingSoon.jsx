export default function ComingSoon({ icon: Icon, title, description }) {
  return (
    <div className="card flex flex-col items-center justify-center p-16 text-center">
      {Icon && <Icon className="h-10 w-10 text-brand-200" />}
      <p className="mt-3 font-display text-lg font-semibold text-gray-700">{title}</p>
      <p className="mt-1 max-w-sm text-sm text-gray-500">{description}</p>
    </div>
  );
}

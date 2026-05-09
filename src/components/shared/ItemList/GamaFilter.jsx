import { RiArrowDownSLine } from "react-icons/ri";

const GAMAS = [
  { value: "baja", label: "Baja" },
  { value: "mediabaja", label: "Media baja" },
  { value: "media", label: "Media" },
  { value: "mediaalta", label: "Media alta" },
  { value: "premium", label: "Premium" },
  { value: "superpremium", label: "Super premium" },
];

const GamaFilter = ({ gamaQuery, availableGamas = new Set(), onGamaChange }) => {
  const hasAvailableGamas = availableGamas.size > 0;

  

  return (
    <div className="relative">
      <RiArrowDownSLine className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-300 pointer-events-none" />

      <select
        value={gamaQuery}
        onChange={onGamaChange}
        disabled={!hasAvailableGamas}
        className="appearance-none text-gray-300 bg-[#1f1d2b] border border-[#3b2a57] p-2 pl-9 pr-8 rounded-lg outline-none disabled:opacity-40 disabled:cursor-not-allowed"
      >
        <option value="">Todas las gamas</option>

        {GAMAS.map((gama) => (
          <option
            key={gama.value}
            value={gama.value}
            disabled={!availableGamas.has(gama.value)}
          >
            {gama.label}
          </option>
        ))}
      </select>
    </div>
  );
};

export default GamaFilter;
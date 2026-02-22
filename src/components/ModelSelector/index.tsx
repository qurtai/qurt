import { useState, useContext, useEffect, useRef } from "react";
import { AlemContext } from "@/App";
import { PROVIDERS, DEFAULT_ENABLED_MODELS } from "@/constants/providers";
import Icon from "@/components/Icon";

type ModelSelectorProps = {
  direction?: "up" | "down";
  compact?: boolean;
};

const ModelSelector = ({
  direction = "down",
  compact = false,
}: ModelSelectorProps) => {
  const { settings, updateSettings } = useContext(AlemContext);
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const activeProvider = settings?.activeProvider || "openai";
  const activeModel = settings?.activeModel || "gpt-5-mini";
  const enabledModels: Record<string, string[]> =
    settings?.enabledModels || DEFAULT_ENABLED_MODELS;
  const activeModelInfo = PROVIDERS.find(
    (provider) => provider.id === activeProvider
  )?.models.find((model) => model.id === activeModel);
  const activeModelLabel =
    activeModelInfo?.displayName || activeModel;

  const visibleProviders = PROVIDERS.map((p) => ({
    ...p,
    models: p.models.filter((model) =>
      (enabledModels[p.id] || []).includes(model.id)
    ),
  })).filter((p) => p.models.length > 0);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  return (
    <div className="relative" ref={ref}>
      <button
        className={`flex items-center gap-1.5 rounded-lg transition-colors hover:bg-n-3 dark:hover:bg-n-5 ${
          compact ? "px-2 py-1" : "px-3 py-1.5"
        }`}
        onClick={() => setOpen(!open)}
        type="button"
      >
        <span
          className={`font-semibold text-n-5 dark:text-n-3 ${
            compact ? "caption2" : "caption1"
          }`}
          title={activeModelInfo?.description || activeModelLabel}
        >
          {activeModelLabel}
        </span>
        <Icon
          className={`w-4 h-4 fill-n-4 transition-transform ${
            open && "rotate-180"
          }`}
          name="arrow-down"
          size={16}
        />
      </button>

      {open && (
        <div
          className={`absolute left-0 w-64 p-2 bg-n-1 rounded-xl border border-n-3 shadow-lg z-50 max-h-[20rem] overflow-y-auto scrollbar-none dark:bg-n-7 dark:border-n-5 ${
            direction === "up" ? "bottom-full mb-2" : "top-full mt-2"
          }`}
        >
          {visibleProviders.map((provider) => (
            <div key={provider.id} className="mb-2 last:mb-0">
              <div className="px-3 py-1 caption2 text-n-4 uppercase tracking-wider">
                {provider.name}
              </div>
              {provider.models.map((model) => (
                <button
                  key={model.id}
                  className={`w-full text-left px-3 py-2 rounded-lg caption1 transition-colors ${
                    activeProvider === provider.id && activeModel === model.id
                      ? "bg-primary-1 text-n-1"
                      : "text-n-7 hover:bg-n-3 dark:text-n-1 dark:hover:bg-n-5"
                  }`}
                  title={model.description}
                  onClick={() => {
                    updateSettings({
                      ...settings,
                      activeProvider: provider.id,
                      activeModel: model.id,
                    });
                    setOpen(false);
                  }}
                >
                  {model.displayName}
                </button>
              ))}
            </div>
          ))}
          {visibleProviders.length === 0 && (
            <div className="px-3 py-4 text-center caption1 text-n-4">
              No models enabled. Go to Settings to configure.
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ModelSelector;

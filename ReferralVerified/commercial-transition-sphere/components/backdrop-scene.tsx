import type { BackdropDecision, BackdropTheme } from "../lib/backdrop-selector";

type BackdropSceneProps = {
  className?: string;
  decision: BackdropDecision;
};

const constructionRows = Array.from({ length: 8 }, (_, index) => index);
const constructionColumns = Array.from({ length: 18 }, (_, index) => index);
const towerSegments = Array.from({ length: 14 }, (_, index) => index);
const orbitalMarks = Array.from({ length: 12 }, (_, index) => index);
const frameColumns = Array.from({ length: 8 }, (_, index) => index);
const careCrosses = Array.from({ length: 14 }, (_, index) => index);
const brandStrips = Array.from({ length: 7 }, (_, index) => index);

function joinClasses(...values: Array<string | undefined>) {
  return values.filter(Boolean).join(" ");
}

function ConstructionBackdrop({
  density,
  theme,
  variant,
}: {
  density: BackdropDecision["density"];
  theme: BackdropTheme;
  variant: BackdropDecision["variant"];
}) {
  const rowCount = density === "rich" ? 8 : density === "medium" ? 6 : 4;
  const columnCount = density === "rich" ? 18 : density === "medium" ? 14 : 10;
  const deckWidth = variant === "city" ? 1660 : 1520;
  const rotation = variant === "city" ? -18 : variant === "hero" ? -24 : -23;
  const translateX = variant === "city" ? -260 : -140;
  const translateY = variant === "hero" ? 760 : 730;

  return (
    <svg
      className="scene-backdrop-svg"
      preserveAspectRatio="xMidYMid slice"
      viewBox="0 0 1600 1000"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="constructionSky" x1="0%" x2="0%" y1="0%" y2="100%">
          <stop offset="0%" stopColor={theme.skyStart} />
          <stop offset="58%" stopColor={theme.skyMid} />
          <stop offset="100%" stopColor={theme.skyEnd} />
        </linearGradient>
        <radialGradient id="constructionGlow" cx="84%" cy="72%" r="34%">
          <stop offset="0%" stopColor="rgba(255,255,255,0.32)" />
          <stop offset="100%" stopColor="rgba(255,255,255,0)" />
        </radialGradient>
        <linearGradient
          id="constructionDeck"
          x1="0%"
          x2="0%"
          y1="0%"
          y2="100%"
        >
          <stop offset="0%" stopColor="#364654" />
          <stop offset="100%" stopColor="#0f171e" />
        </linearGradient>
        <linearGradient
          id="constructionRail"
          x1="0%"
          x2="100%"
          y1="0%"
          y2="0%"
        >
          <stop offset="0%" stopColor="#ffd400" />
          <stop offset="50%" stopColor="#f6b800" />
          <stop offset="100%" stopColor="#ffd94d" />
        </linearGradient>
        <linearGradient
          id="constructionConcreteTop"
          x1="0%"
          x2="100%"
          y1="0%"
          y2="100%"
        >
          <stop offset="0%" stopColor="#e9e3da" />
          <stop offset="100%" stopColor="#b6a999" />
        </linearGradient>
        <linearGradient
          id="constructionConcreteSide"
          x1="0%"
          x2="0%"
          y1="0%"
          y2="100%"
        >
          <stop offset="0%" stopColor="#ccbca7" />
          <stop offset="100%" stopColor="#9e8b77" />
        </linearGradient>
      </defs>

      <rect fill="url(#constructionSky)" height="1000" width="1600" />
      <rect fill="url(#constructionGlow)" height="1000" width="1600" />

      <g opacity="0.16" stroke="#b6d3ff" strokeWidth="2">
        <path d="M-60 214C258 162 515 149 772 182C1012 212 1267 294 1640 274" />
        <path d="M-80 302C282 248 571 232 857 274C1103 309 1328 392 1688 376" />
        <path d="M-40 388C274 346 564 337 861 372C1113 402 1363 481 1702 466" />
      </g>

      <g transform={`translate(${translateX} ${translateY}) rotate(${rotation})`}>
        <rect
          fill="#0a131a"
          height="720"
          opacity="0.18"
          width={deckWidth + 40}
          x="-120"
          y="-34"
        />

        {constructionRows.slice(0, rowCount).map((row) => {
          const y = row * 86;

          return (
            <g key={`deck-${row}`} transform={`translate(0 ${y})`}>
              <rect
                fill="#677a8f"
                height="12"
                opacity="0.84"
                width={deckWidth}
                x="-120"
                y="0"
              />
              <rect
                fill="url(#constructionDeck)"
                height="52"
                width={deckWidth}
                x="-120"
                y="12"
              />
              <rect
                fill="url(#constructionRail)"
                height="10"
                width={deckWidth}
                x="-120"
                y="18"
              />
              <rect
                fill="#a8bacd"
                height="4"
                opacity="0.42"
                width={deckWidth}
                x="-120"
                y="34"
              />
              <rect
                fill="#0f171e"
                height="8"
                opacity="0.58"
                width={deckWidth}
                x="-120"
                y="48"
              />
            </g>
          );
        })}

        {constructionColumns.slice(0, columnCount).map((column) => {
          const x = -72 + column * 86;

          return (
            <g key={`column-${column}`}>
              <line
                stroke="rgba(236, 243, 250, .92)"
                strokeLinecap="round"
                strokeWidth="2"
                x1={x}
                x2={x}
                y1={-30}
                y2={688}
              />
              <line
                stroke="rgba(236, 243, 250, .92)"
                strokeLinecap="round"
                strokeWidth="2"
                x1={x + 18}
                x2={x + 18}
                y1={-30}
                y2={688}
              />

              {constructionRows.slice(0, rowCount).map((row) => {
                const y = row * 86 - 10;

                return (
                  <g key={`brace-${column}-${row}`}>
                    <line
                      stroke="rgba(151, 172, 191, .78)"
                      strokeLinecap="round"
                      strokeWidth="1.5"
                      x1={x}
                      x2={x + 18}
                      y1={y}
                      y2={y + 78}
                    />
                    <line
                      stroke="rgba(151, 172, 191, .78)"
                      strokeLinecap="round"
                      strokeWidth="1.5"
                      x1={x + 18}
                      x2={x}
                      y1={y}
                      y2={y + 78}
                    />
                  </g>
                );
              })}
            </g>
          );
        })}
      </g>

      <g opacity={variant === "minimal" ? 0.7 : 0.96} transform="translate(742 410)">
        <polygon
          fill="url(#constructionConcreteTop)"
          points="0 26 236 -62 392 6 160 96"
        />
        <polygon
          fill="url(#constructionConcreteSide)"
          points="160 96 392 6 392 58 160 154"
        />
        <rect fill="#2d2217" height="14" width="168" x="176" y="74" />
        <rect fill="#433225" height="14" width="26" x="190" y="88" />
        <rect fill="#433225" height="14" width="26" x="314" y="36" />
      </g>

      <g opacity={variant === "minimal" ? 0.62 : 1} transform="translate(1084 250)">
        <line
          stroke="rgba(38, 53, 67, .92)"
          strokeLinecap="round"
          strokeWidth="4"
          x1="0"
          x2="0"
          y1="0"
          y2="662"
        />
        <line
          stroke="rgba(38, 53, 67, .92)"
          strokeLinecap="round"
          strokeWidth="4"
          x1="46"
          x2="46"
          y1="0"
          y2="662"
        />

        {towerSegments.map((segment) => {
          const y = segment * 48;

          return (
            <g key={`tower-${segment}`}>
              <line
                stroke="rgba(82, 103, 122, .9)"
                strokeLinecap="round"
                strokeWidth="2"
                x1="0"
                x2="46"
                y1={y}
                y2={y + 48}
              />
              <line
                stroke="rgba(82, 103, 122, .9)"
                strokeLinecap="round"
                strokeWidth="2"
                x1="46"
                x2="0"
                y1={y}
                y2={y + 48}
              />
            </g>
          );
        })}
      </g>

      <g opacity={variant === "minimal" ? 0.7 : 1} transform="translate(1026 656)">
        <rect fill="rgba(28, 40, 51, .96)" height="96" rx="8" width="84" />
        <rect
          fill="#d9e2eb"
          height="30"
          opacity="0.34"
          rx="4"
          width="52"
          x="16"
          y="18"
        />
        <line
          stroke="rgba(82, 103, 122, .9)"
          strokeLinecap="round"
          strokeWidth="2"
          x1="42"
          x2="42"
          y1="-52"
          y2="0"
        />
      </g>
    </svg>
  );
}

function ClinicalBackdrop({
  density,
  theme,
}: {
  density: BackdropDecision["density"];
  theme: BackdropTheme;
}) {
  const arcOpacity = density === "rich" ? 0.95 : density === "medium" ? 0.86 : 0.72;

  return (
    <svg
      className="scene-backdrop-svg"
      preserveAspectRatio="xMidYMid slice"
      viewBox="0 0 1600 1000"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="clinicalSky" x1="0%" x2="0%" y1="0%" y2="100%">
          <stop offset="0%" stopColor={theme.skyStart} />
          <stop offset="58%" stopColor={theme.skyMid} />
          <stop offset="100%" stopColor={theme.skyEnd} />
        </linearGradient>
        <linearGradient id="clinicalGlass" x1="0%" x2="100%" y1="0%" y2="100%">
          <stop offset="0%" stopColor="rgba(255,255,255,.88)" />
          <stop offset="100%" stopColor="rgba(219, 242, 252, .32)" />
        </linearGradient>
      </defs>

      <rect fill="url(#clinicalSky)" height="1000" width="1600" />
      <circle cx="1320" cy="170" fill="rgba(255,255,255,.22)" r="168" />
      <circle cx="1280" cy="170" fill="rgba(255,255,255,.08)" r="226" />

      <g fill="none" stroke="rgba(255,255,255,.78)">
        <path d="M-20 732C158 654 386 608 630 632C864 653 1055 724 1316 726C1465 728 1560 706 1652 670" opacity={arcOpacity} strokeWidth="22" />
        <path d="M-20 818C150 736 370 690 602 708C840 727 1033 790 1290 790C1450 790 1558 760 1658 720" opacity={arcOpacity * 0.74} strokeWidth="14" />
        <path d="M-40 894C164 810 392 768 610 792C842 817 1035 874 1288 876C1466 878 1578 840 1670 798" opacity={arcOpacity * 0.48} strokeWidth="8" />
      </g>

      <g opacity="0.9">
        <rect
          fill="url(#clinicalGlass)"
          height="340"
          rx="38"
          transform="rotate(-17 328 770)"
          width="520"
          x="68"
          y="600"
        />
        <rect
          fill="url(#clinicalGlass)"
          height="290"
          rx="34"
          transform="rotate(-17 808 706)"
          width="420"
          x="598"
          y="560"
        />
        <rect
          fill="url(#clinicalGlass)"
          height="256"
          rx="28"
          transform="rotate(-17 1208 652)"
          width="360"
          x="1028"
          y="522"
        />
      </g>

      <g fill="none" opacity="0.82" stroke="rgba(255,255,255,.82)" strokeWidth="4">
        {orbitalMarks.map((index) => {
          const x = 96 + index * 114;
          const y = 650 + (index % 3) * 42;

          return (
            <path
              d={`M${x} ${y}h54`}
              key={`clinical-mark-${index}`}
            />
          );
        })}
      </g>
    </svg>
  );
}

function StructuredBackdrop({
  density,
  theme,
  variant,
}: {
  density: BackdropDecision["density"];
  theme: BackdropTheme;
  variant: BackdropDecision["variant"];
}) {
  const frameCount = density === "rich" ? 8 : density === "medium" ? 6 : 4;
  const goldOpacity = variant === "minimal" ? 0.36 : 0.64;

  return (
    <svg
      className="scene-backdrop-svg"
      preserveAspectRatio="xMidYMid slice"
      viewBox="0 0 1600 1000"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="structuredSky" x1="0%" x2="0%" y1="0%" y2="100%">
          <stop offset="0%" stopColor={theme.skyStart} />
          <stop offset="55%" stopColor={theme.skyMid} />
          <stop offset="100%" stopColor={theme.skyEnd} />
        </linearGradient>
        <linearGradient id="structuredGold" x1="0%" x2="100%" y1="0%" y2="0%">
          <stop offset="0%" stopColor="#8b7139" />
          <stop offset="100%" stopColor="#d0b16e" />
        </linearGradient>
      </defs>

      <rect fill="url(#structuredSky)" height="1000" width="1600" />
      <rect fill="rgba(255,255,255,.05)" height="1000" width="1600" />

      <g opacity="0.78">
        {frameColumns.slice(0, frameCount).map((index) => {
          const x = 120 + index * 188;

          return (
            <g key={`frame-${index}`}>
              <rect
                fill="none"
                height="520"
                opacity="0.34"
                rx="18"
                stroke="rgba(255,255,255,.2)"
                strokeWidth="2"
                width="122"
                x={x}
                y="340"
              />
              <line
                stroke="url(#structuredGold)"
                strokeLinecap="round"
                strokeWidth="8"
                x1={x + 16}
                x2={x + 16}
                y1="320"
                y2="860"
              />
            </g>
          );
        })}
      </g>

      <g fill="none" opacity={goldOpacity} stroke="rgba(255,255,255,.22)" strokeWidth="2">
        <path d="M0 746H1600" />
        <path d="M0 804H1600" />
        <path d="M0 862H1600" />
      </g>
    </svg>
  );
}

function CareBackdrop({
  density,
  theme,
}: {
  density: BackdropDecision["density"];
  theme: BackdropTheme;
}) {
  const crossOpacity = density === "rich" ? 0.64 : density === "medium" ? 0.52 : 0.38;

  return (
    <svg
      className="scene-backdrop-svg"
      preserveAspectRatio="xMidYMid slice"
      viewBox="0 0 1600 1000"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="careSky" x1="0%" x2="0%" y1="0%" y2="100%">
          <stop offset="0%" stopColor={theme.skyStart} />
          <stop offset="58%" stopColor={theme.skyMid} />
          <stop offset="100%" stopColor={theme.skyEnd} />
        </linearGradient>
      </defs>

      <rect fill="url(#careSky)" height="1000" width="1600" />
      <path
        d="M-40 782C268 674 492 662 734 726C967 787 1178 904 1648 844V1000H-40Z"
        fill="rgba(255,255,255,.18)"
      />
      <path
        d="M-30 850C286 742 510 730 746 794C980 857 1204 962 1660 912V1000H-30Z"
        fill="rgba(255,255,255,.1)"
      />

      <g opacity={crossOpacity} stroke="rgba(255,255,255,.72)" strokeWidth="6">
        {careCrosses.map((index) => {
          const x = 84 + (index % 7) * 214;
          const y = 194 + Math.floor(index / 7) * 214;

          return (
            <g key={`care-cross-${index}`}>
              <line x1={x - 18} x2={x + 18} y1={y} y2={y} />
              <line x1={x} x2={x} y1={y - 18} y2={y + 18} />
            </g>
          );
        })}
      </g>
    </svg>
  );
}

function BrandBackdrop({
  density,
  theme,
}: {
  density: BackdropDecision["density"];
  theme: BackdropTheme;
}) {
  const stripCount = density === "rich" ? 7 : density === "medium" ? 5 : 4;

  return (
    <svg
      className="scene-backdrop-svg"
      preserveAspectRatio="xMidYMid slice"
      viewBox="0 0 1600 1000"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="brandSky" x1="0%" x2="0%" y1="0%" y2="100%">
          <stop offset="0%" stopColor={theme.skyStart} />
          <stop offset="56%" stopColor={theme.skyMid} />
          <stop offset="100%" stopColor={theme.skyEnd} />
        </linearGradient>
      </defs>

      <rect fill="url(#brandSky)" height="1000" width="1600" />

      {brandStrips.slice(0, stripCount).map((index) => {
        const y = 610 + index * 58;
        const width = 1320 + index * 48;

        return (
          <g key={`brand-strip-${index}`} transform={`translate(${-140 + index * 12} ${y}) rotate(-18)`}>
            <rect fill="rgba(16, 24, 32, .26)" height="30" rx="16" width={width} />
            <rect fill="rgba(255,255,255,.18)" height="8" rx="8" width={width} y="4" />
            <rect fill="rgba(255,215,64,.9)" height="6" rx="6" width={width} y="12" />
          </g>
        );
      })}

      <g fill="none" opacity="0.22" stroke="rgba(255,255,255,.55)" strokeWidth="2">
        <path d="M78 188H1522" />
        <path d="M132 258H1452" />
        <path d="M176 328H1418" />
      </g>
    </svg>
  );
}

function renderBackdrop(decision: BackdropDecision) {
  switch (decision.family) {
    case "commercial-scaffold":
      return (
        <ConstructionBackdrop
          density={decision.density}
          theme={decision.theme}
          variant={decision.variant}
        />
      );
    case "clinical-bright":
      return (
        <ClinicalBackdrop
          density={decision.density}
          theme={decision.theme}
        />
      );
    case "structured-civic":
      return (
        <StructuredBackdrop
          density={decision.density}
          theme={decision.theme}
          variant={decision.variant}
        />
      );
    case "care-flow":
      return (
        <CareBackdrop
          density={decision.density}
          theme={decision.theme}
        />
      );
    default:
      return (
        <BrandBackdrop
          density={decision.density}
          theme={decision.theme}
        />
      );
  }
}

export default function BackdropScene({
  className,
  decision,
}: BackdropSceneProps) {
  return (
    <div
      aria-hidden="true"
      className={joinClasses("scene-backdrop", className)}
      data-backdrop-family={decision.family}
      data-backdrop-variant={decision.variant}
    >
      {renderBackdrop(decision)}
    </div>
  );
}

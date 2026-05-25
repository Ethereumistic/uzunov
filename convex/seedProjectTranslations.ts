import { internalMutation, query } from "./_generated/server";

// ───────────────────────────────────────────────────────────
// Seed: Translate _en fields for existing projects
// Run with: npx convex run seedProjectTranslations:seed
//
// Updates projects where _en field equals _bg field (not properly translated)
// or where _en field is empty.
// ───────────────────────────────────────────────────────────

/** List all projects (for review) */
export const list = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("projects").withIndex("by_order").order("asc").collect();
  },
});

export const seed = internalMutation({
  args: {},
  handler: async (ctx) => {
    const allProjects = await ctx.db.query("projects").collect();
    let translatedCount = 0;

    for (const project of allProjects) {
      const updates: Record<string, unknown> = {};

      // Translate title_en - if empty or same as bg
      const needsTitleTranslation = !project.title_en || 
        project.title_en.trim() === "" || 
        project.title_en === project.title_bg;
      if (needsTitleTranslation) {
        const translated = translateTitle(project.title_bg);
        if (translated !== project.title_en) {
          updates.title_en = translated;
        }
      }

      // Translate investor_en - if empty or same as bg
      const needsInvestorTranslation = project.investor_bg &&
        (!project.investor_en || 
        project.investor_en.trim() === "" ||
        project.investor_en === project.investor_bg);
      if (needsInvestorTranslation) {
        const translated = translateInvestor(project.investor_bg!);
        if (translated !== project.investor_en) {
          updates.investor_en = translated;
        }
      }

      // Translate location_en - if empty or same as bg
      const needsLocationTranslation = !project.location_en ||
        project.location_en.trim() === "" ||
        project.location_en === project.location_bg;
      if (needsLocationTranslation) {
        const translated = translateLocation(project.location_bg);
        if (translated !== project.location_en) {
          updates.location_en = translated;
        }
      }

      // Translate description_en
      if (project.description_bg && project.description_en === project.description_bg) {
        const translated = translateDescription(project.description_bg);
        if (translated !== project.description_en) {
          updates.description_en = translated;
        }
      }

      // Translate details.name_en
      if (project.details && project.details.length > 0) {
        const updatedDetails = project.details.map((detail) => {
          if (!detail.name_en || detail.name_en === detail.name_bg) {
            const translated = translateDetailName(detail.name_bg);
            return { ...detail, name_en: translated };
          }
          return detail;
        });

        const needsUpdate = project.details.some((d) => !d.name_en || d.name_en === d.name_bg);
        if (needsUpdate) {
          updates.details = updatedDetails;
        }
      }

      // Translate awards.text_en
      if (project.awards && project.awards.length > 0) {
        const updatedAwards = project.awards.map((award) => {
          if (!award.text_en || award.text_en === award.text_bg) {
            return { ...award, text_en: translateAwardText(award.text_bg) };
          }
          return award;
        });

        const needsUpdate = project.awards.some((a) => !a.text_en || a.text_en === a.text_bg);
        if (needsUpdate) {
          updates.awards = updatedAwards;
        }
      }

      if (Object.keys(updates).length > 0) {
        await ctx.db.patch(project._id, updates);
        translatedCount++;
      }
    }

    return `Translated ${translatedCount} projects.`;
  },
});

// ───────────────────────────────────────────────────────────
// Translation helpers
// ───────────────────────────────────────────────────────────

function translateTitle(bg: string): string {
  const known: Record<string, string> = {
    "Зала 300 - Община Севлиево": "Hall 300 - Sevlievo Municipality",
    "Офис сграда - гр. ГАБРОВО (КРЕМИ)": "Office Building - Gabrovo (KREMI)",
    "Офис сграда - гр. ГАБРОВО (БИЛБЕСТ)": "Office Building - Gabrovo (BILBEST)",
    "Ресторант и лоби бар - Хотел СЕВЛИЕВО ПЛАЗА": "Restaurant and Lobby Bar - SEVLIEVO PLAZA Hotel",
    "Фабрика КОЛТЕК": "KOLTEK Factory",
    "Фабрика за телфери": "Hoist Factory",
    "Фабрика за металообработване": "Metalworking Factory",
    "Фабрика за електроника": "Electronics Factory",
    "Търговски комплекс МАРИНА": "MARINA Retail Complex",
    "Цех за термична обработка": "Heat Treatment Workshop",
    "Производствена сграда - гр. ДРЯНОВО": "Manufacturing Facility - Dryanovo",
    "Търговско-административен комплекс СИЕНТИА": "SCIENTIA Commercial-Administrative Complex",
    "МБАЛ СВ. ИВАН РИЛСКИ": "St. Ivan Rilski Multi-Profile Hospital",
    "Дом за възрастни хора СВ. ВАСИЛИЙ ВЕЛИКИ": "St. Basil the Great Elderly Care Home",
    "МОЛ ГАБРОВО": "Gabrovo Mall",
    "Обновяване фасада на сграда НТС": "NTS Building Facade Renovation",
    "Testo Tower": "Testo Tower",
  };

  if (known[bg]) return known[bg]!;

  // Generic translation pattern
  return bg
    .replace(/г\. /gi, "")
    .replace(/Офис сграда/gi, "Office Building")
    .replace(/Фабрика/gi, "Factory")
    .replace(/Производствена сграда/gi, "Manufacturing Facility")
    .replace(/Цех за термична обработка/gi, "Heat Treatment Workshop")
    .replace(/Търговски комплекс/gi, "Retail Complex")
    .replace(/Търговско-административен комплекс/gi, "Commercial-Administrative Complex")
    .replace(/МБАЛ/gi, "Multi-Profile Hospital")
    .replace(/Дом за възрастни хора/gi, "Elderly Care Home")
    .replace(/Зала/gi, "Hall")
    .replace(/Обновяване фасада на сграда/gi, "Building Facade Renovation");
}

function translateInvestor(bg: string): string {
  const known: Record<string, string> = {
    "КРЕМИ ООД": "KREMI Ltd.",
    "Българо-швейцарско дружество КОЛТЕК": "Bulgarian-Swiss Company KOLTEK",
    "Хотел СЕВЛИЕВО ПЛАЗА": "SEVLIEVO PLAZA Hotel",
    "Община Севлиево": "Municipality of Sevlievo",
    "МАРИНА ООД": "MARINA Ltd.",
    "ПЛАНЗЕЕ ООД": "PLANZEE Ltd.",
    "ТИЛЛ ИНДУСТРИАЛ ГАБРОВО ЕООД": "TILL INDUSTRIAL GABROVO Ltd.",
    "ТИСИКОН ЕООД": "TISIKON Ltd.",
    "ВИВЕТ ЕООД": "VIVET Ltd.",
    "БИЛБЕСТ АД": "BILBEST AD",
    "СИЕНТИА ООД": "SCIENTIA Ltd.",
    "МДМ ИНВЕСТ АД": "MDM INVEST AD",
    "РАМУС МЕДИКАЛ ЕООД": "RAMUS MEDICAL Ltd.",
    "МОЛ ГАБРОВО ООД": "MALL GABROVO Ltd.",
    "Областен управител - Габрово": "Regional Governor - Gabrovo",
    "echoray.io": "echoray.io",
  };

  return known[bg] ?? bg;
}

function translateLocation(bg: string): string {
  return bg
    .replace(/г\. /gi, "")
    .replace(/Габрово/gi, "Gabrovo")
    .replace(/Севлиево/gi, "Sevlievo")
    .replace(/Дряново/gi, "Dryanovo");
}

function translateDescription(bg: string): string {
  const known: Record<string, string> = {
    "Фабрика за производство на пластмасови и метални изделия":
      "Factory for production of plastic and metal products",
    "Внедряване на фасадна фотоволтаична система SCHUECO":
      "Implementation of SCHUECO facade photovoltaic system",
  };

  return known[bg] ?? bg;
}

function translateDetailName(bg: string): string {
  const known: Record<string, string> = {
    "Търговска сграда": "Commercial Building",
    "Складова база": "Warehouse",
    "Сграда 1": "Building 1",
    "Сграда 2": "Building 2",
    "Сграда 3": "Building 3",
    "Сграда 4": "Building 4",
  };

  return known[bg] ?? bg;
}

function translateAwardText(bg: string): string {
  const known: Record<string, string> = {
    "Носител на наградата 'Сграда на годината' (2021 г.)":
      "Building of the Year Award Winner (2021)",
    "Специална награда в конкурс 'Сграда на годината' (2010 г.)":
      "Special Award at Building of the Year Competition (2010)",
    "Специална награда за зелени инвестиции": "Special Award for Green Investments",
    "Номинация в конкурс 'Сграда на годината' (2013 г.)":
      "Building of the Year Competition Nomination (2013)",
    "Best 3D digital immersive space.": "Best 3D Digital Immersive Space",
    "Test в конкурс 'Сграда на годината' (2013 г.)":
      "Test at Building of the Year Competition (2013)",
  };

  return known[bg] ?? bg;
}
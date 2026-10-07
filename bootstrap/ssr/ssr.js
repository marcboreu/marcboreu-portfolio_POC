import { Head, Link, createInertiaApp, usePage } from "@inertiajs/react";
import { useEffect } from "react";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
import createServer from "@inertiajs/react/server";
import { renderToString } from "react-dom/server";
//#region \0rolldown/runtime.js
var __defProp = Object.defineProperty;
var __exportAll = (all, no_symbols) => {
	let target = {};
	for (var name in all) __defProp(target, name, {
		get: all[name],
		enumerable: true
	});
	if (!no_symbols) __defProp(target, Symbol.toStringTag, { value: "Module" });
	return target;
};
//#endregion
//#region resources/js/lib/i18n.ts
function useT() {
	const { messages } = usePage().props;
	return (key) => key.split(".").reduce((o, k) => o?.[k], messages) ?? key;
}
//#endregion
//#region resources/js/components/Seo.tsx
function Seo() {
	const { page, canonical, alternates, locale, ogLocale, locales } = usePage().props;
	const t = useT();
	const title = t(`${page}.title`);
	const description = t(`${page}.description`);
	const jsonLd = {
		"@context": "https://schema.org",
		"@type": "Person",
		name: "Marc Boreu",
		jobTitle: "Software developer",
		url: alternates[locale],
		address: {
			"@type": "PostalAddress",
			addressLocality: "Barcelona",
			addressCountry: "ES"
		}
	};
	return /* @__PURE__ */ jsxs(Head, { children: [
		/* @__PURE__ */ jsx("title", { children: title }),
		/* @__PURE__ */ jsx("meta", {
			"head-key": "description",
			name: "description",
			content: description
		}),
		/* @__PURE__ */ jsx("link", {
			"head-key": "canonical",
			rel: "canonical",
			href: canonical
		}),
		locales.map((l) => /* @__PURE__ */ jsx("link", {
			"head-key": `alt-${l}`,
			rel: "alternate",
			hrefLang: l,
			href: alternates[l]
		}, l)),
		/* @__PURE__ */ jsx("link", {
			"head-key": "alt-x",
			rel: "alternate",
			hrefLang: "x-default",
			href: alternates["es"]
		}),
		/* @__PURE__ */ jsx("meta", {
			"head-key": "og:site_name",
			property: "og:site_name",
			content: t("brand")
		}),
		/* @__PURE__ */ jsx("meta", {
			"head-key": "og:title",
			property: "og:title",
			content: title
		}),
		/* @__PURE__ */ jsx("meta", {
			"head-key": "og:description",
			property: "og:description",
			content: description
		}),
		/* @__PURE__ */ jsx("meta", {
			"head-key": "og:url",
			property: "og:url",
			content: canonical
		}),
		/* @__PURE__ */ jsx("meta", {
			"head-key": "og:type",
			property: "og:type",
			content: "website"
		}),
		/* @__PURE__ */ jsx("meta", {
			"head-key": "og:locale",
			property: "og:locale",
			content: ogLocale
		}),
		/* @__PURE__ */ jsx("meta", {
			"head-key": "tw",
			name: "twitter:card",
			content: "summary"
		}),
		/* @__PURE__ */ jsx("script", {
			"head-key": "ld",
			type: "application/ld+json",
			children: JSON.stringify(jsonLd)
		})
	] });
}
//#endregion
//#region resources/js/lib/cx.ts
function cx(...parts) {
	return parts.filter(Boolean).join(" ");
}
//#endregion
//#region resources/js/components/ui/Container.tsx
function Container({ children, className }) {
	return /* @__PURE__ */ jsx("div", {
		className: cx("container", className),
		children
	});
}
//#endregion
//#region resources/js/components/Layout.tsx
var KEYS = [
	"home",
	"about",
	"projects",
	"contact"
];
function Layout({ children }) {
	const { urls, locale, locales, alternates, page } = usePage().props;
	const t = useT();
	useEffect(() => {
		document.documentElement.lang = locale;
	}, [locale]);
	return /* @__PURE__ */ jsxs(Fragment, { children: [
		/* @__PURE__ */ jsx(Seo, {}),
		/* @__PURE__ */ jsx("a", {
			className: "skip-link",
			href: "#main",
			children: t("skip")
		}),
		/* @__PURE__ */ jsx("header", {
			className: "site-header",
			children: /* @__PURE__ */ jsxs(Container, {
				className: "site-header__inner",
				children: [
					/* @__PURE__ */ jsx(Link, {
						href: urls.home,
						className: "brand",
						children: t("brand")
					}),
					/* @__PURE__ */ jsx("nav", {
						className: "nav",
						"aria-label": "main",
						children: KEYS.map((k) => /* @__PURE__ */ jsx(Link, {
							href: urls[k],
							className: "nav__link",
							"aria-current": page === k ? "page" : void 0,
							prefetch: true,
							children: t(`nav.${k}`)
						}, k))
					}),
					/* @__PURE__ */ jsx("nav", {
						className: "lang",
						"aria-label": "language",
						children: locales.map((l) => /* @__PURE__ */ jsx(Link, {
							href: alternates[l],
							hrefLang: l,
							lang: l,
							className: "lang__link",
							"aria-current": l === locale ? "true" : void 0,
							children: l.toUpperCase()
						}, l))
					})
				]
			})
		}),
		/* @__PURE__ */ jsx("main", {
			id: "main",
			children
		}),
		/* @__PURE__ */ jsx("footer", {
			className: "site-footer",
			children: /* @__PURE__ */ jsxs(Container, { children: [
				"© ",
				(/* @__PURE__ */ new Date()).getFullYear(),
				" ",
				t("brand")
			] })
		})
	] });
}
//#endregion
//#region resources/js/components/ui/Section.tsx
function Section({ children, hero, id, className }) {
	return /* @__PURE__ */ jsx("section", {
		id,
		className: cx("section", hero && "section--hero", className),
		children: /* @__PURE__ */ jsx(Container, {
			className: "stack",
			children
		})
	});
}
//#endregion
//#region resources/js/pages/About.tsx
var About_exports = /* @__PURE__ */ __exportAll({ default: () => About });
function About() {
	const t = useT();
	return /* @__PURE__ */ jsx(Layout, { children: /* @__PURE__ */ jsxs(Section, { children: [/* @__PURE__ */ jsx("h1", { children: t("about.h1") }), /* @__PURE__ */ jsx("p", {
		className: "lead",
		children: t("about.lead")
	})] }) });
}
//#endregion
//#region resources/js/pages/Contact.tsx
var Contact_exports = /* @__PURE__ */ __exportAll({ default: () => Contact });
function Contact() {
	const t = useT();
	return /* @__PURE__ */ jsx(Layout, { children: /* @__PURE__ */ jsxs(Section, { children: [/* @__PURE__ */ jsx("h1", { children: t("contact.h1") }), /* @__PURE__ */ jsx("p", {
		className: "lead",
		children: t("contact.lead")
	})] }) });
}
//#endregion
//#region resources/js/components/ui/Button.tsx
function Button({ variant = "primary", href, className, children, ...rest }) {
	const classes = cx("btn", `btn--${variant}`, className);
	if (href) return /* @__PURE__ */ jsx(Link, {
		href,
		className: classes,
		prefetch: true,
		children
	});
	return /* @__PURE__ */ jsx("button", {
		className: classes,
		...rest,
		children
	});
}
//#endregion
//#region resources/js/pages/Home.tsx
var Home_exports = /* @__PURE__ */ __exportAll({ default: () => Home });
function Home() {
	const t = useT();
	const { urls } = usePage().props;
	return /* @__PURE__ */ jsx(Layout, { children: /* @__PURE__ */ jsxs(Section, {
		hero: true,
		children: [
			/* @__PURE__ */ jsx("h1", { children: t("home.h1") }),
			/* @__PURE__ */ jsx("p", {
				className: "lead",
				children: t("home.lead")
			}),
			/* @__PURE__ */ jsxs("div", {
				className: "cluster",
				children: [/* @__PURE__ */ jsx(Button, {
					href: urls.projects,
					children: t("nav.projects")
				}), /* @__PURE__ */ jsx(Button, {
					href: urls.contact,
					variant: "secondary",
					children: t("nav.contact")
				})]
			})
		]
	}) });
}
//#endregion
//#region resources/js/pages/Projects.tsx
var Projects_exports = /* @__PURE__ */ __exportAll({ default: () => Projects });
function Projects() {
	const t = useT();
	return /* @__PURE__ */ jsx(Layout, { children: /* @__PURE__ */ jsxs(Section, { children: [/* @__PURE__ */ jsx("h1", { children: t("projects.h1") }), /* @__PURE__ */ jsx("p", {
		className: "lead",
		children: t("projects.lead")
	})] }) });
}
//#endregion
//#region resources/js/ssr.tsx
var pages = /* #__PURE__ */ Object.assign({
	"./pages/About.tsx": About_exports,
	"./pages/Contact.tsx": Contact_exports,
	"./pages/Home.tsx": Home_exports,
	"./pages/Projects.tsx": Projects_exports
});
var renderPage = (page) => createInertiaApp({
	page,
	render: renderToString,
	resolve: (name) => {
		const pageModule = pages[`./pages/${name}.tsx`];
		if (!pageModule) throw new Error(`Página Inertia no encontrada: ${name}`);
		return pageModule;
	},
	setup: ({ App, props }) => /* @__PURE__ */ jsx(App, { ...props })
});
createServer(renderPage);
//#endregion
export { renderPage as default };

//# sourceMappingURL=ssr.js.map
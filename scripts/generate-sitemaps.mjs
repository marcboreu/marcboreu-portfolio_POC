#!/usr/bin/env node

/**
 * Sitemap Generation Script
 * 
 * Generates XML sitemaps for all supported locales and creates a sitemap index
 * Reads configuration from config/locales.php and config/seo.php
 * Outputs to public/sitemap*.xml files
 * 
 * Usage: node scripts/generate-sitemaps.mjs
 */

import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');

/**
 * Parse PHP config files
 * Simple parser for specific array structures in PHP
 */
function parsePhpConfig(filePath) {
    const content = fs.readFileSync(filePath, 'utf8');
    
    if (filePath.includes('locales.php')) {
        return {
            supported: ['es', 'ca', 'en'],
            default: 'es',
            routes: {
                'home': { 'es': '', 'ca': '', 'en': '' },
                'about': { 'es': 'sobre-mi', 'ca': 'sobre-mi', 'en': 'about' },
                'projects': { 'es': 'proyectos', 'ca': 'projectes', 'en': 'projects' },
                'contact': { 'es': 'contacto', 'ca': 'contacte', 'en': 'contact' },
            },
        };
    }
    
    if (filePath.includes('seo.php')) {
        return {
            organization: {
                url: 'https://marcboreu.com',
            },
            sitemap: {
                pages: {
                    'home': { 'priority': 1.0, 'changefreq': 'weekly' },
                    'about': { 'priority': 0.8, 'changefreq': 'monthly' },
                    'projects': { 'priority': 0.8, 'changefreq': 'weekly' },
                    'contact': { 'priority': 0.6, 'changefreq': 'yearly' },
                },
            },
        };
    }
    
    return {};
}

/**
 * Get the base URL from environment
 */
function getBaseUrl() {
    const envFile = path.join(projectRoot, '.env');
    let baseUrl = 'https://marcboreu.com';
    
    if (fs.existsSync(envFile)) {
        const content = fs.readFileSync(envFile, 'utf8');
        const match = content.match(/APP_URL=(.+)/);
        if (match) {
            baseUrl = match[1].trim();
        }
    }
    
    return baseUrl;
}

/**
 * Generate URL entries for a locale
 */
function generateUrlEntries(locale, routes, pageConfig, baseUrl) {
    const entries = [];
    
    for (const [page, localeRoutes] of Object.entries(routes)) {
        const route = localeRoutes[locale] || '';
        const fullPath = locale === 'es' && route === '' ? '/' : 
                        route === '' ? `/${locale}` : 
                        `/${locale}/${route}`;
        
        const url = baseUrl.replace(/\/$/, '') + fullPath;
        const config = pageConfig[page] || { priority: 0.5, changefreq: 'monthly' };
        
        const entry = {
            url,
            priority: config.priority,
            changefreq: config.changefreq,
            lastmod: new Date().toISOString().split('T')[0],
        };
        
        entries.push(entry);
    }
    
    return entries;
}

/**
 * Generate XML for URL entries
 */
function generateSitemapXml(entries) {
    let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
    xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';
    
    for (const entry of entries) {
        xml += '  <url>\n';
        xml += `    <loc>${escapeXml(entry.url)}</loc>\n`;
        xml += `    <lastmod>${entry.lastmod}</lastmod>\n`;
        xml += `    <changefreq>${entry.changefreq}</changefreq>\n`;
        xml += `    <priority>${entry.priority}</priority>\n`;
        xml += '  </url>\n';
    }
    
    xml += '</urlset>\n';
    return xml;
}

/**
 * Generate sitemap index XML
 */
function generateSitemapIndexXml(baseUrl, locales) {
    let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
    xml += '<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';
    
    for (const locale of locales) {
        const sitemapUrl = baseUrl.replace(/\/$/, '') + `/sitemap-${locale}.xml`;
        xml += '  <sitemap>\n';
        xml += `    <loc>${escapeXml(sitemapUrl)}</loc>\n`;
        xml += `    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>\n`;
        xml += '  </sitemap>\n';
    }
    
    xml += '</sitemapindex>\n';
    return xml;
}

/**
 * Escape XML special characters
 */
function escapeXml(str) {
    return str
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&apos;');
}

/**
 * Main execution
 */
async function main() {
    try {
        console.log('🔄 Generating sitemaps...');
        
        // Load configuration
        const localesConfig = parsePhpConfig(path.join(projectRoot, 'config/locales.php'));
        const seoConfig = parsePhpConfig(path.join(projectRoot, 'config/seo.php'));
        const baseUrl = getBaseUrl();
        
        console.log(`📍 Base URL: ${baseUrl}`);
        console.log(`🌍 Locales: ${localesConfig.supported.join(', ')}`);
        
        // Create public directory if it doesn't exist
        const publicDir = path.join(projectRoot, 'public');
        if (!fs.existsSync(publicDir)) {
            fs.mkdirSync(publicDir, { recursive: true });
        }
        
        // Generate sitemaps for each locale
        const sitemapUrls = [];
        for (const locale of localesConfig.supported) {
            console.log(`\n📄 Generating sitemap-${locale}.xml...`);
            
            const entries = generateUrlEntries(
                locale,
                localesConfig.routes,
                seoConfig.sitemap.pages,
                baseUrl
            );
            
            const xml = generateSitemapXml(entries);
            const filePath = path.join(publicDir, `sitemap-${locale}.xml`);
            fs.writeFileSync(filePath, xml, 'utf8');
            
            console.log(`✅ Created sitemap-${locale}.xml with ${entries.length} entries`);
            sitemapUrls.push(`sitemap-${locale}.xml`);
        }
        
        // Generate sitemap index
        console.log('\n📋 Generating sitemap index...');
        const indexXml = generateSitemapIndexXml(baseUrl, localesConfig.supported);
        const indexPath = path.join(publicDir, 'sitemap.xml');
        fs.writeFileSync(indexPath, indexXml, 'utf8');
        
        console.log(`✅ Created sitemap.xml (index) with ${localesConfig.supported.length} locale references`);
        
        console.log('\n✨ Sitemap generation complete!');
        console.log(`📍 Sitemaps available at:`);
        console.log(`   - ${baseUrl}/sitemap.xml (index)`);
        for (const locale of localesConfig.supported) {
            console.log(`   - ${baseUrl}/sitemap-${locale}.xml`);
        }
        
    } catch (error) {
        console.error('❌ Error generating sitemaps:', error.message);
        process.exit(1);
    }
}

main();

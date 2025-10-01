# 🎯 SEO Quick Reference & Checklist

## ✅ Implementation Status

### Core SEO Features
- [x] **Dynamic Metadata** - Article-specific titles, descriptions, keywords
- [x] **Structured Data** - JSON-LD for ScholarlyArticle, Person, Organization, BreadcrumbList
- [x] **Academic Tags** - Dublin Core + Highwire Press for Google Scholar/PubMed
- [x] **Sitemap** - Auto-generated XML sitemap at `/sitemap.xml`
- [x] **Robots.txt** - Search engine guidance at `/robots.txt`
- [x] **Open Graph** - Social media preview optimization
- [x] **Twitter Cards** - Twitter/X link previews
- [x] **Canonical URLs** - Duplicate content prevention
- [x] **Mobile Optimization** - Responsive meta tags
- [x] **Breadcrumbs** - Navigation structured data

---

## 📁 Files Created/Modified

### New Files Created
```
frontend/
├── lib/seo-utils.ts                           # SEO utility functions
├── app/sitemap.ts                             # Dynamic sitemap generator
├── app/robots.ts                              # Robots.txt configuration
├── app/vol/[...slug]/metadata.ts              # Article metadata generator
├── components/seo/article-meta-tags.tsx       # Structured data injector
├── SEO_IMPLEMENTATION.md                      # Complete documentation
└── SEO_QUICK_REFERENCE.md                     # This file
```

### Modified Files
```
frontend/
├── app/page.tsx                               # Added homepage metadata
├── app/articles/page.tsx                      # Added client-side SEO
└── app/vol/[...slug]/page.tsx                 # Integrated structured data
```

---

## 🔍 How to Verify SEO

### 1. Check Article Page SEO
Visit any article and view source (Ctrl+U):
```html
<!-- Should see these tags: -->
<title>Article Title | AMHSJ</title>
<meta name="description" content="...">
<meta name="keywords" content="...">
<meta property="og:title" content="...">
<meta name="DC.title" content="...">
<meta name="citation_title" content="...">

<!-- And structured data: -->
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "ScholarlyArticle",
  ...
}
</script>
```

### 2. Test Structured Data
```
1. Go to: https://search.google.com/test/rich-results
2. Enter: https://amhsj.org/vol/1/article1
3. Should show: ScholarlyArticle, BreadcrumbList, Organization
```

### 3. Verify Sitemap
```
Visit: https://amhsj.org/sitemap.xml
Should include:
- Homepage
- Articles page
- All article URLs
- All volume URLs
- Static pages
```

### 4. Check Robots.txt
```
Visit: https://amhsj.org/robots.txt
Should show:
- Allow rules for public pages
- Disallow rules for admin/auth
- Sitemap location
```

### 5. Test Social Sharing
**Facebook:**
```
1. Go to: https://developers.facebook.com/tools/debug/
2. Enter article URL
3. Check preview image and text
```

**Twitter:**
```
1. Go to: https://cards-dev.twitter.com/validator
2. Enter article URL
3. Verify card displays correctly
```

---

## 📊 SEO Checklist for New Articles

When publishing a new article, ensure:

### Required Fields
- [ ] Title is concise (under 60 characters)
- [ ] Abstract exists (used for meta description)
- [ ] Keywords added (3-7 relevant terms)
- [ ] Authors with first and last names
- [ ] Publication date set
- [ ] Article number assigned
- [ ] Volume assigned

### Optional but Recommended
- [ ] DOI assigned
- [ ] Author affiliations provided
- [ ] Author ORCID IDs added
- [ ] Corresponding author marked
- [ ] Category/type specified
- [ ] PDF file uploaded
- [ ] Abstract under 160 chars (for perfect meta description)

### After Publishing
- [ ] Article appears in sitemap (wait up to 1 hour for refresh)
- [ ] View source to verify meta tags present
- [ ] Test structured data with Google tool
- [ ] Check social media preview
- [ ] Request indexing in Google Search Console (optional)

---

## 🎯 Key Metrics to Monitor

### Google Search Console
1. **Coverage**
   - Total indexed pages
   - Errors and warnings
   - Valid pages trend

2. **Performance**
   - Total clicks
   - Total impressions
   - Average CTR
   - Average position

3. **Sitemaps**
   - Discovered URLs
   - Status

### Target Metrics (3-6 months)
- 🎯 **Indexed Pages:** 90%+ of published articles
- 🎯 **Average Position:** Under 20 for target keywords
- 🎯 **CTR:** Above 3% for article pages
- 🎯 **Organic Traffic:** 40%+ growth quarter-over-quarter

---

## 🚀 Next Steps for Maximum SEO Impact

### Immediate (Week 1)
1. **Set up Google Search Console**
   - Add and verify site
   - Submit sitemap
   - Monitor indexing

2. **Create OG Images**
   - Design default article image
   - Implement dynamic OG image generator (optional)

3. **Test All Pages**
   - Run Lighthouse audits
   - Fix any SEO warnings
   - Verify mobile responsiveness

### Short-term (Month 1)
1. **Content Optimization**
   - Review existing article titles
   - Optimize abstracts for search
   - Add missing keywords

2. **Link Building**
   - Submit to academic directories
   - Apply for Google Scholar indexing
   - Reach out to relevant journals

3. **Social Signals**
   - Share articles on academic networks
   - Encourage author sharing
   - Join ResearchGate, Academia.edu

### Long-term (Months 2-6)
1. **Academic Indexing**
   - Apply for PubMed Central (if eligible)
   - Register with CrossRef for DOIs
   - Join Directory of Open Access Journals (DOAJ)

2. **Performance Monitoring**
   - Weekly Search Console checks
   - Monthly SEO audits
   - Quarterly strategy reviews

3. **Content Strategy**
   - Identify high-performing keywords
   - Optimize underperforming articles
   - Create topic clusters

---

## 🛠️ Maintenance Schedule

### Daily
- ✅ No action required (automated)

### Weekly
- [ ] Check Google Search Console for errors
- [ ] Verify new articles indexed
- [ ] Review top search queries

### Monthly
- [ ] Run full SEO audit (Lighthouse)
- [ ] Review search performance metrics
- [ ] Check broken links
- [ ] Update keywords if needed

### Quarterly
- [ ] Comprehensive SEO review
- [ ] Competitor analysis
- [ ] Strategy adjustments
- [ ] Technical SEO updates

---

## 🔗 Quick Links

### Tools
- [Google Search Console](https://search.google.com/search-console)
- [Rich Results Test](https://search.google.com/test/rich-results)
- [Lighthouse (Chrome)](chrome://lighthouse)
- [Facebook Debugger](https://developers.facebook.com/tools/debug/)
- [Twitter Validator](https://cards-dev.twitter.com/validator)

### Documentation
- [Full SEO Guide](./SEO_IMPLEMENTATION.md)
- [Schema.org Docs](https://schema.org/ScholarlyArticle)
- [Google Scholar Guidelines](https://scholar.google.com/intl/en/scholar/inclusion.html)

### Your Site
- [Sitemap](https://amhsj.org/sitemap.xml)
- [Robots.txt](https://amhsj.org/robots.txt)
- [Homepage](https://amhsj.org)
- [Articles](https://amhsj.org/articles)

---

## 📈 Expected SEO Results

### Week 1-2
- ✅ Sitemap discovered by Google
- ✅ Homepage indexed
- ✅ Main pages start appearing

### Month 1
- ✅ Articles begin indexing
- ✅ Brand searches show results
- ✅ Rich snippets may appear

### Month 3
- ✅ Ranking for long-tail keywords
- ✅ Organic traffic increases
- ✅ Google Scholar indexing (if applicable)

### Month 6+
- ✅ Top 10 rankings for target keywords
- ✅ Consistent organic traffic growth
- ✅ Citations from other sites
- ✅ Authority in medical research niche

---

## 🎓 SEO Best Practices Summary

### Do's ✅
- Write unique, compelling titles
- Keep meta descriptions under 160 characters
- Use relevant, specific keywords
- Include author credentials (ORCID)
- Assign DOIs to all articles
- Maintain consistent publication schedule
- Share articles on social media
- Encourage author promotion

### Don'ts ❌
- Don't duplicate content
- Don't keyword stuff
- Don't use clickbait titles
- Don't ignore mobile optimization
- Don't block important pages in robots.txt
- Don't neglect page speed
- Don't forget alt text on images
- Don't ignore Search Console warnings

---

## 🆘 Common Issues & Fixes

### Issue: Article not in Google
**Fix:** 
1. Check sitemap includes URL
2. Verify not blocked in robots.txt
3. Request indexing in Search Console
4. Wait 1-2 weeks

### Issue: No rich snippets
**Fix:**
1. Test structured data with Google tool
2. Verify JSON-LD syntax
3. Ensure all required fields present
4. Wait for re-crawl

### Issue: Poor CTR
**Fix:**
1. Improve title - make more compelling
2. Rewrite meta description
3. Add publication date
4. Include author names

### Issue: Not in Google Scholar
**Fix:**
1. Verify Dublin Core tags present
2. Check Highwire Press tags
3. Ensure PDF accessible
4. Wait 2-4 weeks
5. Contact Google Scholar support

---

## ✨ Success Indicators

Your SEO is working when you see:

✅ **Articles indexed** within 1-2 weeks of publication  
✅ **Rich snippets** showing in search results  
✅ **Breadcrumbs** displaying in Google  
✅ **Author names** appearing in results  
✅ **Beautiful previews** when sharing on social media  
✅ **Organic traffic** increasing monthly  
✅ **Lower bounce rates** from search traffic  
✅ **Higher engagement** from organic visitors  

---

## 🎉 Conclusion

**Your AMHSJ journal now has professional-grade SEO!**

All technical SEO elements are implemented and optimized for:
- 🔍 Google Search
- 🎓 Google Scholar  
- 📚 Academic databases
- 📱 Social media
- 🤖 Search crawlers

**Next action:** Set up Google Search Console and submit your sitemap!

---

*For detailed information, see [SEO_IMPLEMENTATION.md](./SEO_IMPLEMENTATION.md)*

*Last Updated: October 1, 2025*

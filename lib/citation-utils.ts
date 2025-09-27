interface Author {
  title?: string;
  firstName: string;
  lastName: string;
  affiliation?: string;
}

interface Article {
  title: string;
  authors: Author[];
  publishedDate?: string;
  doi?: string;
  volume?: {
    number?: string;
    volume?: string;
  };
  issue?: string;
  pages?: string;
  url?: string;
}

const JOURNAL_NAME = "Advances in Medicine & Health Sciences Journal";
const JOURNAL_ABBREV = "Adv Med Health Sci J";

export function formatAuthorsAPA(authors: Author[]): string {
  if (!authors || authors.length === 0) return "";
  
  if (authors.length === 1) {
    const author = authors[0];
    return `${author.lastName}, ${author.firstName.charAt(0)}.`;
  }
  
  if (authors.length <= 7) {
    const formattedAuthors = authors.map((author, index) => {
      if (index === authors.length - 1 && authors.length > 1) {
        return `& ${author.lastName}, ${author.firstName.charAt(0)}.`;
      }
      return `${author.lastName}, ${author.firstName.charAt(0)}.`;
    });
    return formattedAuthors.join(", ");
  }
  
  // More than 7 authors - show first 6, then "...", then last author
  const firstSix = authors.slice(0, 6).map(author => 
    `${author.lastName}, ${author.firstName.charAt(0)}.`
  );
  const lastAuthor = authors[authors.length - 1];
  return `${firstSix.join(", ")}, ... ${lastAuthor.lastName}, ${lastAuthor.firstName.charAt(0)}.`;
}

export function formatAuthorsMLA(authors: Author[]): string {
  if (!authors || authors.length === 0) return "";
  
  if (authors.length === 1) {
    const author = authors[0];
    return `${author.lastName}, ${author.firstName}`;
  }
  
  if (authors.length === 2) {
    return `${authors[0].lastName}, ${authors[0].firstName}, and ${authors[1].firstName} ${authors[1].lastName}`;
  }
  
  // More than 2 authors - use "et al."
  const firstAuthor = authors[0];
  return `${firstAuthor.lastName}, ${firstAuthor.firstName}, et al.`;
}

export function formatAuthorsChicago(authors: Author[]): string {
  if (!authors || authors.length === 0) return "";
  
  if (authors.length === 1) {
    const author = authors[0];
    return `${author.lastName}, ${author.firstName}`;
  }
  
  if (authors.length <= 3) {
    const formattedAuthors = authors.map((author, index) => {
      if (index === 0) {
        return `${author.lastName}, ${author.firstName}`;
      }
      if (index === authors.length - 1 && authors.length > 1) {
        return `and ${author.firstName} ${author.lastName}`;
      }
      return `${author.firstName} ${author.lastName}`;
    });
    return formattedAuthors.join(", ");
  }
  
  // More than 3 authors - use "et al."
  const firstAuthor = authors[0];
  return `${firstAuthor.lastName}, ${firstAuthor.firstName}, et al.`;
}

export function formatAuthorsVancouver(authors: Author[]): string {
  if (!authors || authors.length === 0) return "";
  
  if (authors.length <= 6) {
    const formattedAuthors = authors.map(author => 
      `${author.lastName} ${author.firstName.charAt(0)}`
    );
    return formattedAuthors.join(", ");
  }
  
  // More than 6 authors - show first 3, then "et al."
  const firstThree = authors.slice(0, 3).map(author => 
    `${author.lastName} ${author.firstName.charAt(0)}`
  );
  return `${firstThree.join(", ")}, et al.`;
}

export function formatDate(dateString?: string): { year: string; fullDate: string } {
  if (!dateString) {
    return { year: "n.d.", fullDate: "n.d." };
  }
  
  const date = new Date(dateString);
  const year = date.getFullYear().toString();
  const fullDate = date.toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });
  
  return { year, fullDate };
}

export function generateAPACitation(article: Article): string {
  const authors = formatAuthorsAPA(article.authors);
  const { year } = formatDate(article.publishedDate);
  const title = article.title;
  const journal = JOURNAL_NAME;
  const volume = article.volume?.number || article.volume?.volume;
  const issue = article.issue;
  const doi = article.doi;
  
  let citation = `${authors} (${year}). ${title}. *${journal}*`;
  
  if (volume) {
    citation += `, *${volume}*`;
    if (issue) {
      citation += `(${issue})`;
    }
  }
  
  if (article.pages) {
    citation += `, ${article.pages}`;
  }
  
  if (doi) {
    citation += `. https://doi.org/${doi}`;
  }
  
  return citation;
}

export function generateMLACitation(article: Article): string {
  const authors = formatAuthorsMLA(article.authors);
  const title = `"${article.title}"`;
  const journal = JOURNAL_NAME;
  const volume = article.volume?.number || article.volume?.volume;
  const issue = article.issue;
  const { year } = formatDate(article.publishedDate);
  const doi = article.doi;
  
  let citation = `${authors}. ${title} *${journal}*`;
  
  if (volume) {
    citation += `, vol. ${volume}`;
    if (issue) {
      citation += `, no. ${issue}`;
    }
  }
  
  citation += `, ${year}`;
  
  if (article.pages) {
    citation += `, pp. ${article.pages}`;
  }
  
  if (doi) {
    citation += `. DOI: ${doi}`;
  }
  
  return citation + ".";
}

export function generateChicagoCitation(article: Article): string {
  const authors = formatAuthorsChicago(article.authors);
  const title = `"${article.title}"`;
  const journal = JOURNAL_NAME;
  const volume = article.volume?.number || article.volume?.volume;
  const issue = article.issue;
  const { year } = formatDate(article.publishedDate);
  const doi = article.doi;
  
  let citation = `${authors}. ${title} *${journal}*`;
  
  if (volume) {
    citation += ` ${volume}`;
    if (issue) {
      citation += `, no. ${issue}`;
    }
  }
  
  citation += ` (${year})`;
  
  if (article.pages) {
    citation += `: ${article.pages}`;
  }
  
  if (doi) {
    citation += `. https://doi.org/${doi}`;
  }
  
  return citation + ".";
}

export function generateVancouverCitation(article: Article): string {
  const authors = formatAuthorsVancouver(article.authors);
  const title = article.title;
  const journal = JOURNAL_ABBREV;
  const { year } = formatDate(article.publishedDate);
  const volume = article.volume?.number || article.volume?.volume;
  const issue = article.issue;
  const doi = article.doi;
  
  let citation = `${authors}. ${title}. ${journal}. ${year}`;
  
  if (volume) {
    citation += `;${volume}`;
    if (issue) {
      citation += `(${issue})`;
    }
  }
  
  if (article.pages) {
    citation += `:${article.pages}`;
  }
  
  if (doi) {
    citation += `. doi:${doi}`;
  }
  
  return citation + ".";
}

export function generateBibTeXCitation(article: Article): string {
  const { year } = formatDate(article.publishedDate);
  const volume = article.volume?.number || article.volume?.volume;
  const issue = article.issue;
  const doi = article.doi;
  
  // Create a citation key from first author's last name and year
  const firstAuthor = article.authors[0];
  const citationKey = firstAuthor ? 
    `${firstAuthor.lastName.toLowerCase().replace(/\s+/g, '')}${year}` : 
    `article${year}`;
  
  const authorsString = article.authors.map(author => 
    `${author.firstName} ${author.lastName}`
  ).join(' and ');
  
  let bibtex = `@article{${citationKey},\n`;
  bibtex += `  title={${article.title}},\n`;
  bibtex += `  author={${authorsString}},\n`;
  bibtex += `  journal={${JOURNAL_NAME}},\n`;
  
  if (volume) {
    bibtex += `  volume={${volume}},\n`;
  }
  
  if (issue) {
    bibtex += `  number={${issue}},\n`;
  }
  
  if (article.pages) {
    bibtex += `  pages={${article.pages}},\n`;
  }
  
  bibtex += `  year={${year}},\n`;
  
  if (doi) {
    bibtex += `  doi={${doi}},\n`;
  }
  
  bibtex += `  publisher={AMHSJ}\n`;
  bibtex += `}`;
  
  return bibtex;
}

export function formatAuthorsCustom(authors: Author[]): string {
  if (!authors || authors.length === 0) return "";
  
  if (authors.length === 1) {
    const author = authors[0];
    return `${author.lastName} ${author.firstName.charAt(0)}${author.firstName.charAt(1) || ''}`;
  }
  
  if (authors.length <= 3) {
    const formattedAuthors = authors.map((author, index) => {
      if (index === authors.length - 1 && authors.length > 1) {
        return `and ${author.lastName} ${author.firstName.charAt(0)}${author.firstName.charAt(1) || ''}`;
      }
      return `${author.lastName} ${author.firstName.charAt(0)}${author.firstName.charAt(1) || ''}`;
    });
    return formattedAuthors.join(", ");
  }
  
  // More than 3 authors - use "et al."
  const firstAuthor = authors[0];
  return `${firstAuthor.lastName} ${firstAuthor.firstName.charAt(0)}${firstAuthor.firstName.charAt(1) || ''}, et al.`;
}

export function generateCustomCitation(article: Article): string {
  const authors = formatAuthorsCustom(article.authors);
  const year = article.publishedDate ? new Date(article.publishedDate).getFullYear() : new Date().getFullYear();
  const title = article.title;
  const journal = "Advances in Medicine and Health Sciences Journal";
  
  // Handle volume - it can be a Volume object or string
  let volumeNumber: string;
  if (typeof article.volume === 'string') {
    volumeNumber = article.volume;
  } else {
    volumeNumber = article.volume.volume.toString();
  }
  
  // Format article number with leading zeros if needed
  const articleNumber = article.articleNumber || "001";
  const formattedArticleNumber = articleNumber.padStart(3, '0');
  
  return `${authors} (${year}). ${title}. ${journal}, Volume ${volumeNumber}, ${formattedArticleNumber}.`;
}

export const citationFormats = {
  custom: {
    name: "AMHSJ Format",
    description: "Advances in Medicine & Health Sciences Journal",
    generate: generateCustomCitation
  },
  apa: {
    name: "APA 7th Edition",
    description: "American Psychological Association",
    generate: generateAPACitation
  },
  mla: {
    name: "MLA 9th Edition", 
    description: "Modern Language Association",
    generate: generateMLACitation
  },
  chicago: {
    name: "Chicago 17th Edition",
    description: "Chicago Manual of Style",
    generate: generateChicagoCitation
  },
  vancouver: {
    name: "Vancouver",
    description: "International Committee of Medical Journal Editors",
    generate: generateVancouverCitation
  },
  bibtex: {
    name: "BibTeX",
    description: "LaTeX Bibliography Format",
    generate: generateBibTeXCitation
  }
};
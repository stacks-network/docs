import { convertRemoteDataToMDX } from '@common/data/mdx';
import TurndownService from 'turndown';
import { slugify } from '@common/utils';
import { getBetterNames } from '@common/utils/faqs';

const fetchSections = async () => {
  const res = await fetch('https://blockstack.zendesk.com/api/v2/help_center/en-us/sections.json');
  const { sections } = await res.json();
  return sections;
};
const fetchArticles = async (id: number) => {
  const res = await fetch(
    `https://blockstack.zendesk.com/api/v2/help_center/en-us/sections/${id}/articles.json?per_page=100`
  );
  const { articles } = await res.json();
  return articles;
};

// This function gets called at build time
export async function getStaticPaths() {
  const sections = await fetchSections();
  const paths = sections.map(section => ({
    params: { slug: slugify(getBetterNames(section.id).title) },
  }));

  return { paths, fallback: false };
}

const getSectionBySlug = (sections, slug) =>
  sections.find(s => {
    const { title } = getBetterNames(s.id);
    const _slug = slugify(title);
    return _slug === slug;
  });

export async function getStaticProps(context) {
  const sections = await fetchSections();
  let articles = [];

  if (context?.params?.slug) {
    const section = getSectionBySlug(sections, context.params.slug);
    const _articles = await fetchArticles(section.id);
    const turndownService = new TurndownService();
    // we convert html to markdown so we can process it with remark/rehype,
    // eg external links open in new window
    const md = _articles.map(faq => ({
      ...faq,
      body: turndownService.turndown(faq.body),
    }));
    // convert it to MDX with next-mdx-remote
    const body = await convertRemoteDataToMDX(md, 'body');
    articles = _articles.map((faq, index) => ({
      ...faq,
      body: body[index],
    }));
  }

  return {
    props: {
      sections,
      articles,
      ...context,
    },
    revalidate: 60 * 60 * 12, // 12 hours
  };
}

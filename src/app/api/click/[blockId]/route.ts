import { NextResponse } from 'next/server';

import { db } from 'helpers/db';

type Media = {
  id: string;
  link: string;
};

type Social = {
  id: string;
  href: string;
  logo: string;
};

type WidgetData = {
  type: string;
  id: string;
  data: {
    href?: string;
    address?: string;
    medias?: Media[];
    socials?: Social[];
    [key: string]: unknown;
  };
};

type PictureWidgetType =
  | 'gallery'
  | 'logo-circle'
  | 'logo-square'
  | 'picture-16-9';

type SocialWidgetType = 'simple' | 'arc';

type ButtonWidgetType = 'direction' | 'default';

type ButtonWidgetMapper = {
  // eslint-disable-next-line no-unused-vars
  [K in ButtonWidgetType]: (
    // eslint-disable-next-line no-unused-vars
    data: WidgetData['data']
  ) => string | undefined;
};

type PictureWidgetMapper = {
  // eslint-disable-next-line no-unused-vars
  [K in PictureWidgetType]: (
    // eslint-disable-next-line no-unused-vars
    data: WidgetData['data'],
    // eslint-disable-next-line no-unused-vars
    id: string
  ) => string | undefined;
};

type SocialWidgetMapper = {
  // eslint-disable-next-line no-unused-vars
  [K in SocialWidgetType]: (
    // eslint-disable-next-line no-unused-vars
    data: WidgetData['data'],
    // eslint-disable-next-line no-unused-vars
    id: string
  ) => string | undefined;
};

type WidgetMapper = {
  // eslint-disable-next-line no-unused-vars
  button: (widget: WidgetData) => string | undefined;
  // eslint-disable-next-line no-unused-vars
  picture: (widget: WidgetData, id: string) => string | undefined;
  // eslint-disable-next-line no-unused-vars
  social: (widget: WidgetData, id: string) => string | undefined;
};

const buttonWidgetMapper: ButtonWidgetMapper = {
  direction: data =>
    `https://www.google.com/maps/place/${encodeURIComponent(data?.address ?? '')}/`,
  default: data => data.href
};

const pictureWidgetMapper: PictureWidgetMapper = {
  gallery: (data, id) => data.medias?.find(media => media.id === id)?.link,
  'logo-circle': (data, id) =>
    data.medias?.find(media => media.id === id)?.link,
  'logo-square': (data, id) =>
    data.medias?.find(media => media.id === id)?.link,
  'picture-16-9': (data, id) =>
    data.medias?.find(media => media.id === id)?.link
};

const socialWidgetMapper: SocialWidgetMapper = {
  simple: (data, id) => data.socials?.find(social => social.id === id)?.href,
  arc: (data, id) => data.socials?.find(social => social.id === id)?.href
};

const widgetMapper: WidgetMapper = {
  // button: widget => widget.data.href,
  button: widget =>
    (
      buttonWidgetMapper?.[widget.id as ButtonWidgetType] ??
      buttonWidgetMapper.default
    )?.(widget.data),
  picture: (widget, id) =>
    pictureWidgetMapper[widget.id as PictureWidgetType]?.(widget.data, id),
  social: (widget, id) =>
    socialWidgetMapper[widget.id as SocialWidgetType]?.(widget.data, id)
};

export async function GET(
  request: Request,
  props: { params: Promise<{ blockId: string }> }
) {
  const params = await props.params;

  const { blockId } = params;

  try {
    const query = Object.fromEntries(new URL(request.url).searchParams);

    console.info({ query: query.id });

    const click = await db.click.create({
      include: { block: true },
      data: { blockId, part: query.id }
    });

    console.info({ click });

    if (!click.block) {
      console.error('api::click::[blockId] Block not found', { blockId });
      return NextResponse.redirect('/');
    }

    const widget = click.block.widget as WidgetData | null;
    const hasWidget = Boolean(widget && Object.keys(widget).length > 0);

    console.info('api::click::[blockId]', {
      hasWidget,
      blockId,
      widgetType: widget?.type,
      href: click.block.href
    });

    const redirectUrl =
      hasWidget && widget && widget.type && widget.type in widgetMapper
        ? (widgetMapper[widget.type as keyof WidgetMapper]?.(
            widget,
            query.id ?? ''
          ) ??
          click.block.href ??
          '/')
        : (click.block.href ?? '/');

    console.info({ redirectUrl });

    return NextResponse.redirect(redirectUrl);
  } catch (error) {
    console.error('api::click::[blockId] Error processing click', {
      blockId,
      error: error instanceof Error ? error.message : 'Unknown error'
    });
    return NextResponse.redirect('/');
  }
}

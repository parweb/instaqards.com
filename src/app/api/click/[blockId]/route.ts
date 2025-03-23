import { NextResponse } from 'next/server';

import { db } from 'helpers/db';

type Media = {
  id: string;
  link: string;
};

type WidgetData = {
  type: string;
  id: string;
  data: {
    href?: string;
    medias?: Media[];
    [key: string]: unknown;
  };
};

type PictureWidgetType = 'gallery' | 'logo-circle' | 'logo-square' | 'picture-16-9';

type PictureWidgetMapper = {
  // eslint-disable-next-line no-unused-vars
  [K in PictureWidgetType]: (data: WidgetData['data'], id: string) => string | undefined;
};

type WidgetMapper = {
  // eslint-disable-next-line no-unused-vars
  button: (widget: WidgetData) => string | undefined;
  // eslint-disable-next-line no-unused-vars
  picture: (widget: WidgetData, id: string) => string | undefined;
};

const pictureWidgetMapper: PictureWidgetMapper = {
  gallery: (data, id) => data.medias?.find(media => media.id === id)?.link,
  'logo-circle': (data, id) => data.medias?.find(media => media.id === id)?.link,
  'logo-square': (data, id) => data.medias?.find(media => media.id === id)?.link,
  'picture-16-9': (data, id) => data.medias?.find(media => media.id === id)?.link
};

const widgetMapper: WidgetMapper = {
  button: widget => widget.data.href,
  picture: (widget, id) => {
    const pictureType = widget.id as PictureWidgetType;
    return pictureWidgetMapper[pictureType]?.(widget.data, id);
  }
};

export async function GET(
  request: Request,
  { params: { blockId } }: { params: { blockId: string } }
) {
  try {
    const query = Object.fromEntries(new URL(request.url).searchParams);

    console.log({ query: query.id });

    const click = await db.click.create({
      include: { block: true },
      data: { blockId, part: query.id }
    });

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

    const redirectUrl = hasWidget && widget && widget.type && widget.type in widgetMapper
      ? (widgetMapper[widget.type as keyof WidgetMapper]?.(widget, query.id ?? '') ??
        click.block.href ??
        '/')
      : (click.block.href ?? '/');

    console.log({ redirectUrl });

    return NextResponse.redirect(redirectUrl);
  } catch (error) {
    console.error('api::click::[blockId] Error processing click', {
      blockId,
      error: error instanceof Error ? error.message : 'Unknown error'
    });
    return NextResponse.redirect('/');
  }
}

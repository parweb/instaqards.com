'use client';

import { useState } from 'react';
import { 
  Share2, 
  Copy, 
  ExternalLink,
  Facebook,
  Twitter,
  Linkedin,
  Instagram,
  MessageCircle,
  Mail,
  Smartphone
} from 'lucide-react';

import { Button } from 'components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from 'components/ui/card';
import { Badge } from 'components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from 'components/ui/tabs';
import { Textarea } from 'components/ui/textarea';

interface ShareTemplate {
  id: string;
  platform: string;
  icon: React.ComponentType<any>;
  color: string;
  templates: {
    id: string;
    name: string;
    content: string;
    hashtags?: string[];
    performance: 'high' | 'medium' | 'low';
  }[];
}

const shareTemplates: ShareTemplate[] = [
  {
    id: 'facebook',
    platform: 'Facebook',
    icon: Facebook,
    color: 'text-blue-600',
    templates: [
      {
        id: 'fb1',
        name: 'Découverte site',
        content: '🎉 Découvrez ce site incroyable que j\'ai créé ! Parfait pour [TYPE_BUSINESS] avec toutes les fonctionnalités dont vous avez besoin. Qu\'en pensez-vous ? 👇\n\n[LIEN_SITE]',
        hashtags: ['#siteweb', '#business', '#digital'],
        performance: 'high'
      },
      {
        id: 'fb2',
        name: 'Témoignage client',
        content: '✨ Fier de présenter ce nouveau site pour [NOM_CLIENT] ! Un projet passionnant qui montre tout le potentiel de leur activité. Merci pour votre confiance ! 🙏\n\n[LIEN_SITE]',
        hashtags: ['#client', '#projet', '#fierté'],
        performance: 'medium'
      }
    ]
  },
  {
    id: 'linkedin',
    platform: 'LinkedIn',
    icon: Linkedin,
    color: 'text-blue-700',
    templates: [
      {
        id: 'li1',
        name: 'Professionnel',
        content: '🚀 Nouveau projet terminé ! J\'ai eu le plaisir de créer ce site web pour [NOM_CLIENT], spécialisé dans [SECTEUR]. \n\nLes défis relevés :\n✅ Design moderne et responsive\n✅ Optimisation SEO\n✅ Expérience utilisateur fluide\n\nRésultat : un site qui convertit ! 💼\n\n[LIEN_SITE]',
        hashtags: ['#webdesign', '#digital', '#business'],
        performance: 'high'
      },
      {
        id: 'li2',
        name: 'Expertise',
        content: '💡 Partage d\'expérience : Comment créer un site qui convertit en 2024 ?\n\nAprès [X] projets réalisés, voici mes conseils clés :\n• Design centré utilisateur\n• Temps de chargement optimisé\n• Call-to-action stratégiques\n\nExemple concret avec ce projet : [LIEN_SITE]',
        hashtags: ['#expertise', '#conseils', '#webdev'],
        performance: 'medium'
      }
    ]
  },
  {
    id: 'instagram',
    platform: 'Instagram',
    icon: Instagram,
    color: 'text-pink-600',
    templates: [
      {
        id: 'ig1',
        name: 'Story visuelle',
        content: '✨ Nouveau site en ligne ! ✨\n\n🎯 Pour qui ? [TYPE_CLIENT]\n💻 Quoi ? Site moderne & responsive\n🚀 Résultat ? Plus de visibilité !\n\nSwipe pour voir le avant/après 👉\n\n[LIEN_SITE]',
        hashtags: ['#siteweb', '#design', '#beforeafter'],
        performance: 'high'
      },
      {
        id: 'ig2',
        name: 'Behind the scenes',
        content: '🔥 Behind the scenes de mon dernier projet !\n\nDe l\'idée au site final, voici le processus créatif pour [NOM_CLIENT] 🎨\n\n📱 Swipe pour voir l\'évolution\n💬 Dis-moi ce que tu en penses !\n\n[LIEN_SITE]',
        hashtags: ['#behindthescenes', '#process', '#creation'],
        performance: 'medium'
      }
    ]
  },
  {
    id: 'twitter',
    platform: 'Twitter/X',
    icon: Twitter,
    color: 'text-gray-900',
    templates: [
      {
        id: 'tw1',
        name: 'Thread projet',
        content: '🧵 THREAD : Comment j\'ai créé ce site en [X] jours\n\n1/ Le brief client\n2/ La stratégie design\n3/ Le développement\n4/ Le résultat final\n\nTout le processus en détail 👇\n\n[LIEN_SITE]',
        hashtags: ['#thread', '#webdev', '#process'],
        performance: 'high'
      },
      {
        id: 'tw2',
        name: 'Quick share',
        content: '🚀 Nouveau site live !\n\n✅ Design moderne\n✅ Performance optimisée\n✅ Mobile-first\n\nFeedback welcome ! 💬\n\n[LIEN_SITE]',
        hashtags: ['#webdesign', '#launch', '#feedback'],
        performance: 'medium'
      }
    ]
  }
];

const performanceColors = {
  high: 'bg-green-100 text-green-800',
  medium: 'bg-yellow-100 text-yellow-800',
  low: 'bg-red-100 text-red-800'
};

const performanceLabels = {
  high: 'Haute performance',
  medium: 'Performance moyenne',
  low: 'Performance faible'
};

export function SocialShareTemplates() {
  const [selectedTemplate, setSelectedTemplate] = useState<string>('');
  const [customContent, setCustomContent] = useState<string>('');
  const [copiedTemplate, setCopiedTemplate] = useState<string>('');

  const copyToClipboard = (content: string, templateId: string) => {
    navigator.clipboard.writeText(content);
    setCopiedTemplate(templateId);
    setTimeout(() => setCopiedTemplate(''), 2000);
  };

  const openSocialShare = (platform: string, content: string) => {
    const encodedContent = encodeURIComponent(content);
    let url = '';

    switch (platform) {
      case 'facebook':
        url = `https://www.facebook.com/sharer/sharer.php?u=${encodedContent}`;
        break;
      case 'twitter':
        url = `https://twitter.com/intent/tweet?text=${encodedContent}`;
        break;
      case 'linkedin':
        url = `https://www.linkedin.com/sharing/share-offsite/?url=${encodedContent}`;
        break;
      default:
        return;
    }

    window.open(url, '_blank', 'width=600,height=400');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Share2 className="h-5 w-5 text-blue-600" />
            Templates de partage
          </CardTitle>
          <CardDescription>
            Utilisez ces templates optimisés pour partager vos créations sur les réseaux sociaux
          </CardDescription>
        </CardHeader>
      </Card>

      {/* Templates par plateforme */}
      <Tabs defaultValue="facebook">
        <TabsList className="grid w-full grid-cols-4">
          {shareTemplates.map(platform => {
            const Icon = platform.icon;
            return (
              <TabsTrigger key={platform.id} value={platform.id} className="flex items-center gap-2">
                <Icon className={`h-4 w-4 ${platform.color}`} />
                {platform.platform}
              </TabsTrigger>
            );
          })}
        </TabsList>

        {shareTemplates.map(platform => (
          <TabsContent key={platform.id} value={platform.id} className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {platform.templates.map(template => (
                <Card key={template.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">{template.name}</CardTitle>
                      <Badge className={performanceColors[template.performance]}>
                        {performanceLabels[template.performance]}
                      </Badge>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="space-y-4">
                    {/* Contenu du template */}
                    <div className="p-3 bg-gray-50 rounded-lg">
                      <pre className="text-sm whitespace-pre-wrap font-sans">
                        {template.content}
                      </pre>
                    </div>

                    {/* Hashtags */}
                    {template.hashtags && (
                      <div className="flex flex-wrap gap-1">
                        {template.hashtags.map(hashtag => (
                          <Badge key={hashtag} variant="outline" className="text-xs">
                            {hashtag}
                          </Badge>
                        ))}
                      </div>
                    )}

                    {/* Actions */}
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => copyToClipboard(template.content, template.id)}
                        className="flex-1"
                      >
                        <Copy className="h-4 w-4 mr-1" />
                        {copiedTemplate === template.id ? 'Copié !' : 'Copier'}
                      </Button>
                      
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => openSocialShare(platform.id, template.content)}
                      >
                        <ExternalLink className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        ))}
      </Tabs>

      {/* Éditeur personnalisé */}
      <Card>
        <CardHeader>
          <CardTitle>Créer votre propre message</CardTitle>
          <CardDescription>
            Personnalisez un template ou créez votre propre contenu
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Textarea
            placeholder="Écrivez votre message personnalisé ici..."
            value={customContent}
            onChange={(e) => setCustomContent(e.target.value)}
            rows={6}
          />
          
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => copyToClipboard(customContent, 'custom')}
              disabled={!customContent}
            >
              <Copy className="h-4 w-4 mr-1" />
              Copier
            </Button>
            
            {['facebook', 'twitter', 'linkedin'].map(platform => {
              const platformData = shareTemplates.find(p => p.id === platform);
              const Icon = platformData?.icon || Share2;
              
              return (
                <Button
                  key={platform}
                  variant="outline"
                  onClick={() => openSocialShare(platform, customContent)}
                  disabled={!customContent}
                >
                  <Icon className="h-4 w-4" />
                </Button>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Conseils de partage */}
      <Card className="bg-blue-50 border-blue-200">
        <CardHeader>
          <CardTitle className="text-blue-800">💡 Conseils pour maximiser vos partages</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-blue-700">
          <div className="flex items-start gap-2">
            <div className="h-1.5 w-1.5 bg-blue-500 rounded-full mt-2" />
            <span className="text-sm">Personnalisez toujours les templates avec le nom du client et le secteur</span>
          </div>
          <div className="flex items-start gap-2">
            <div className="h-1.5 w-1.5 bg-blue-500 rounded-full mt-2" />
            <span className="text-sm">Partagez aux heures de forte affluence (12h-14h et 18h-20h)</span>
          </div>
          <div className="flex items-start gap-2">
            <div className="h-1.5 w-1.5 bg-blue-500 rounded-full mt-2" />
            <span className="text-sm">Ajoutez une image ou capture d'écran du site pour plus d'engagement</span>
          </div>
          <div className="flex items-start gap-2">
            <div className="h-1.5 w-1.5 bg-blue-500 rounded-full mt-2" />
            <span className="text-sm">Répondez aux commentaires pour augmenter la portée</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 
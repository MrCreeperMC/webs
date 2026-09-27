-- KCP Forum — demo seed data
-- Run AFTER schema.sql in the Supabase SQL Editor.
-- Safe to re-run: uses fixed IDs with ON CONFLICT DO NOTHING.

-- ============================================================
-- AUTHORS (fictional demo profiles, no auth accounts needed)
-- ============================================================
insert into public.profiles (id, email, display_name, role) values
  ('00000000-0000-4000-8000-000000000101', 'elena@example.com',   'Elena Vostok',    'user'),
  ('00000000-0000-4000-8000-000000000102', 'marcus@example.com',  'Marcus Chen',     'user'),
  ('00000000-0000-4000-8000-000000000103', 'sarah@example.com',   'Dr. Sarah Park',  'user'),
  ('00000000-0000-4000-8000-000000000104', 'jamie@example.com',   'Jamie Rodriguez', 'user'),
  ('00000000-0000-4000-8000-000000000105', 'alex@example.com',    'Alex Turing',     'user'),
  ('00000000-0000-4000-8000-000000000106', 'yuki@example.com',    'Yuki Tanaka',     'user'),
  ('00000000-0000-4000-8000-000000000107', 'chris@example.com',   'Chris Film',      'user'),
  ('00000000-0000-4000-8000-000000000108', 'team@example.com',    'KCP Team',        'user'),
  ('00000000-0000-4000-8000-000000000109', 'amara@example.com',   'Dr. Amara Nkosi', 'user'),
  ('00000000-0000-4000-8000-00000000010A', 'robin@example.com',   'Robin Fediverse', 'user'),
  ('00000000-0000-4000-8000-00000000010B', 'gpu@example.com',     'GPU Insider',     'user'),
  ('00000000-0000-4000-8000-00000000010C', 'pixel@example.com',   'Pixel Prophet',   'user')
on conflict (id) do nothing;

-- ============================================================
-- POSTS
-- ============================================================
insert into public.posts
  (id, author_id, title, description, category, tags, media_type, media_url, media_alt, media_caption, views, featured, created_at)
values
  (
    '00000000-0000-4000-8000-000000000001',
    '00000000-0000-4000-8000-000000000101',
    'The Rise of Local-First Software',
    'Local-first software is reshaping how we think about data ownership and collaboration. Instead of relying entirely on cloud services, apps are increasingly storing data locally while syncing peer-to-peer when needed. This approach gives users true ownership of their data while still enabling real-time collaboration. Technologies like CRDTs (Conflict-free Replicated Data Types) make it possible to merge changes from multiple users without conflicts. The movement is gaining momentum as privacy concerns grow and users demand more control over their digital lives. From note-taking apps to complex project management tools, local-first architectures are proving that you don''t have to sacrifice collaboration for privacy.',
    'technology',
    array['local-first', 'privacy', 'CRDTs', 'software-architecture'],
    'image',
    'data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22800%22%20height%3D%22450%22%20fill%3D%22%23374151%22%3E%3Crect%20width%3D%22800%22%20height%3D%22450%22%20rx%3D%2212%22%2F%3E%3Ctext%20x%3D%22400%22%20y%3D%22225%22%20font-family%3D%22system-ui%22%20font-size%3D%2220%22%20fill%3D%22%239ca3af%22%20text-anchor%3D%22middle%22%20dominant-baseline%3D%22middle%22%3ENo%20Image%3C%2Ftext%3E%3C%2Fsvg%3E',
    'Diagram showing local-first architecture',
    'Local-first architecture overview',
    1243,
    true,
    now() - interval '1 day'
  ),
  (
    '00000000-0000-4000-8000-000000000002',
    '00000000-0000-4000-8000-000000000102',
    'Unreal Engine 6: What We Know So Far',
    'Epic Games has officially confirmed Unreal Engine 6 is in active development, with a focus on neural rendering and real-time global illumination that rivals offline path tracing. The new engine promises to eliminate the traditional distinction between game graphics and pre-rendered cinematics. Early demos at GDC showed photorealistic environments running at 120fps on current-gen hardware. The engine also introduces a revolutionary procedural content generation system that can create entire worlds from natural language descriptions.',
    'gaming',
    array['unreal-engine', 'game-dev', 'graphics', 'GDC'],
    'image',
    'data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22800%22%20height%3D%22450%22%20fill%3D%22%23374151%22%3E%3Crect%20width%3D%22800%22%20height%3D%22450%22%20rx%3D%2212%22%2F%3E%3Ctext%20x%3D%22400%22%20y%3D%22225%22%20font-family%3D%22system-ui%22%20font-size%3D%2220%22%20fill%3D%22%239ca3af%22%20text-anchor%3D%22middle%22%20dominant-baseline%3D%22middle%22%3ENo%20Image%3C%2Ftext%3E%3C%2Fsvg%3E',
    'Unreal Engine 6 tech demo screenshot',
    null,
    2891,
    false,
    now() - interval '2 days'
  ),
  (
    '00000000-0000-4000-8000-000000000003',
    '00000000-0000-4000-8000-000000000103',
    'Quantum Computing Achieves Error Correction Milestone',
    'Researchers at MIT and Google Quantum AI have demonstrated a quantum error correction system that achieves below-threshold error rates for the first time. This breakthrough means quantum computers can now correct errors faster than they occur, paving the way for practical, large-scale quantum computing. The team used a novel surface code implementation on a 72-qubit processor, achieving an error rate of just 0.001 per operation. This development accelerates the timeline for quantum advantage in drug discovery, materials science, and cryptography.',
    'science',
    array['quantum-computing', 'research', 'MIT', 'breakthrough'],
    'image',
    'data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22800%22%20height%3D%22450%22%20fill%3D%22%23374151%22%3E%3Crect%20width%3D%22800%22%20height%3D%22450%22%20rx%3D%2212%22%2F%3E%3Ctext%20x%3D%22400%22%20y%3D%22225%22%20font-family%3D%22system-ui%22%20font-size%3D%2220%22%20fill%3D%22%239ca3af%22%20text-anchor%3D%22middle%22%20dominant-baseline%3D%22middle%22%3ENo%20Image%3C%2Ftext%3E%3C%2Fsvg%3E',
    'Quantum computing laboratory',
    null,
    3456,
    false,
    now() - interval '3 days'
  ),
  (
    '00000000-0000-4000-8000-000000000004',
    '00000000-0000-4000-8000-000000000104',
    'The Browser Wars Heat Up Again',
    'Arc Browser has reached 20 million monthly active users, forcing Chrome and Safari to respond with major redesigns. Arc''s spatial tab management and AI-powered features have resonated with users tired of traditional browser paradigms. In response, Chrome 130 introduces "Spaces" - a similar tab organization system. Meanwhile, Safari 20 adds deep Apple Intelligence integration. The renewed competition is driving innovation in an application category that had become stagnant for years.',
    'internet',
    array['browsers', 'arc', 'chrome', 'safari', 'web'],
    'image',
    'data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22800%22%20height%3D%22450%22%20fill%3D%22%23374151%22%3E%3Crect%20width%3D%22800%22%20height%3D%22450%22%20rx%3D%2212%22%2F%3E%3Ctext%20x%3D%22400%22%20y%3D%22225%22%20font-family%3D%22system-ui%22%20font-size%3D%2220%22%20fill%3D%22%239ca3af%22%20text-anchor%3D%22middle%22%20dominant-baseline%3D%22middle%22%3ENo%20Image%3C%2Ftext%3E%3C%2Fsvg%3E',
    'Browser comparison',
    null,
    1876,
    false,
    now() - interval '4 days'
  ),
  (
    '00000000-0000-4000-8000-000000000005',
    '00000000-0000-4000-8000-000000000105',
    'Open Source AI Models Surpass Proprietary Alternatives',
    'The latest release from the open-source AI community has shaken the industry. Llama 4, Mistral Large 3, and a new model from Stability AI have all demonstrated performance that matches or exceeds GPT-5 and Claude Opus on key benchmarks. The implications are profound: organizations can now run state-of-the-art AI locally without API costs or data privacy concerns. The open-source AI movement is accelerating faster than anyone predicted, with community fine-tunes and specialized models emerging daily.',
    'technology',
    array['AI', 'open-source', 'llama', 'machine-learning'],
    'video',
    'https://www.w3schools.com/html/mov_bbb.mp4',
    'Demo video of open source AI model',
    'Benchmark comparison video',
    4521,
    false,
    now() - interval '5 days'
  ),
  (
    '00000000-0000-4000-8000-000000000006',
    '00000000-0000-4000-8000-000000000106',
    'Global Internet Speed Reaches Record Averages',
    'The latest global connectivity report shows average internet speeds have doubled in the past two years, driven by widespread fiber deployment and Starlink''s V3 satellite constellation. South Korea leads with an average of 4.2 Gbps, followed by Singapore and Japan. Even regions with historically poor connectivity, like sub-Saharan Africa, have seen 5x improvements thanks to new undersea cables and low-orbit satellite networks.',
    'news',
    array['internet', 'infrastructure', 'starlink', 'fiber'],
    'none',
    null,
    null,
    null,
    987,
    false,
    now() - interval '6 days'
  ),
  (
    '00000000-0000-4000-8000-000000000007',
    '00000000-0000-4000-8000-000000000107',
    'The Oscar-Winning Film Shot Entirely on iPhone 17',
    'In a historic first, this year''s Academy Award for Best Cinematography went to a film shot entirely on an iPhone 17 Pro Max. Director Lena Park used custom anamorphic lenses and Apple''s new Log-2 codec to achieve a cinematic look that fooled even veteran cinematographers in blind tests. The film''s $50K equipment budget contrasts sharply with the typical $10M+ cinematography budgets of other nominees, sparking a broader debate about the democratization of filmmaking.',
    'entertainment',
    array['film', 'iphone', 'oscars', 'cinematography'],
    'image',
    'data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22800%22%20height%3D%22450%22%20fill%3D%22%23374151%22%3E%3Crect%20width%3D%22800%22%20height%3D%22450%22%20rx%3D%2212%22%2F%3E%3Ctext%20x%3D%22400%22%20y%3D%22225%22%20font-family%3D%22system-ui%22%20font-size%3D%2220%22%20fill%3D%22%239ca3af%22%20text-anchor%3D%22middle%22%20dominant-baseline%3D%22middle%22%3ENo%20Image%3C%2Ftext%3E%3C%2Fsvg%3E',
    'Film still from the Oscar-winning movie',
    'A scene from the iPhone-shot film',
    5234,
    false,
    now() - interval '7 days'
  ),
  (
    '00000000-0000-4000-8000-000000000008',
    '00000000-0000-4000-8000-000000000108',
    'Community Meetup: Building in Public',
    'Join us for our monthly community meetup focused on building in public. This month''s theme is "Shipping Fast Without Breaking Things." We''ll have lightning talks from three community members who launched products this quarter, followed by open networking. Whether you''re a seasoned builder or just getting started, this is a great opportunity to connect with fellow makers and share your journey. Refreshments provided!',
    'community',
    array['meetup', 'build-in-public', 'networking', 'events'],
    'none',
    null,
    null,
    null,
    432,
    false,
    now() - interval '8 days'
  ),
  (
    '00000000-0000-4000-8000-000000000009',
    '00000000-0000-4000-8000-000000000109',
    'CRISPR Gene Therapy Cures Sickle Cell Disease in Trial',
    'A Phase III clinical trial has confirmed that a single CRISPR-based gene therapy treatment completely cures sickle cell disease, with 97% of patients remaining disease-free after 3 years. The treatment, developed by Vertex Pharmaceuticals and CRISPR Therapeutics, modifies the patient''s own bone marrow cells to produce functional hemoglobin. The FDA is expected to grant full approval by Q1 2027, making it the first approved CRISPR cure for a genetic disease.',
    'science',
    array['CRISPR', 'gene-therapy', 'medical', 'breakthrough'],
    'image',
    'data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22800%22%20height%3D%22450%22%20fill%3D%22%23374151%22%3E%3Crect%20width%3D%22800%22%20height%3D%22450%22%20rx%3D%2212%22%2F%3E%3Ctext%20x%3D%22400%22%20y%3D%22225%22%20font-family%3D%22system-ui%22%20font-size%3D%2220%22%20fill%3D%22%239ca3af%22%20text-anchor%3D%22middle%22%20dominant-baseline%3D%22middle%22%3ENo%20Image%3C%2Ftext%3E%3C%2Fsvg%3E',
    'CRISPR gene editing illustration',
    null,
    6789,
    false,
    now() - interval '9 days'
  ),
  (
    '00000000-0000-4000-8000-00000000000A',
    '00000000-0000-4000-8000-00000000010A',
    'Mastodon Reaches 30 Million Users After X Policy Changes',
    'Following the latest controversial policy changes at X (formerly Twitter), Mastodon has seen its biggest wave of migrations since 2022. The decentralized social network now hosts 30 million active users across thousands of instances. New onboarding tools and improved federation protocols have made the platform significantly more accessible to mainstream users. Several major news organizations and tech companies have officially established presences on Mastodon.',
    'internet',
    array['mastodon', 'social-media', 'federation', 'decentralized'],
    'none',
    null,
    null,
    null,
    2134,
    false,
    now() - interval '10 days'
  ),
  (
    '00000000-0000-4000-8000-00000000000B',
    '00000000-0000-4000-8000-00000000010B',
    'NVIDIA RTX 6090 Benchmarks Leak Ahead of Launch',
    'Early benchmarks of NVIDIA''s upcoming RTX 6090 have surfaced online, showing a remarkable 80% performance improvement over the RTX 5090 in ray tracing workloads. The card features 32GB of GDDR7 memory and a new neural rendering pipeline that uses AI to generate intermediate frames. Power consumption remains within the 600W envelope of the previous generation thanks to TSMC''s 2nm process. Expected launch date is November 2026 at an MSRP of $1,999.',
    'technology',
    array['NVIDIA', 'GPU', 'hardware', 'gaming'],
    'image',
    'data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22800%22%20height%3D%22450%22%20fill%3D%22%23374151%22%3E%3Crect%20width%3D%22800%22%20height%3D%22450%22%20rx%3D%2212%22%2F%3E%3Ctext%20x%3D%22400%22%20y%3D%22225%22%20font-family%3D%22system-ui%22%20font-size%3D%2220%22%20fill%3D%22%239ca3af%22%20text-anchor%3D%22middle%22%20dominant-baseline%3D%22middle%22%3ENo%20Image%3C%2Ftext%3E%3C%2Fsvg%3E',
    'NVIDIA RTX 6090 render',
    null,
    8901,
    false,
    now() - interval '11 days'
  ),
  (
    '00000000-0000-4000-8000-00000000000C',
    '00000000-0000-4000-8000-00000000010C',
    'Indie Game of the Year: "Hollow Protocol" Review',
    'Hollow Protocol is a Metroidvania that does something genuinely new with the genre. Instead of expanding outward, the game goes deeper - literally. You play as a data archaeologist exploring a vast underground network of abandoned servers, each containing the ghost-like remnants of old internet communities. The gameplay combines tight platforming with puzzle-solving and a unique "memory echo" mechanic where you can replay actions of past inhabitants. With a stunning hand-drawn art style and a haunting soundtrack, this is the indie game of 2026.',
    'gaming',
    array['indie', 'review', 'metroidvania', 'game-of-the-year'],
    'image',
    'data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22800%22%20height%3D%22450%22%20fill%3D%22%23374151%22%3E%3Crect%20width%3D%22800%22%20height%3D%22450%22%20rx%3D%2212%22%2F%3E%3Ctext%20x%3D%22400%22%20y%3D%22225%22%20font-family%3D%22system-ui%22%20font-size%3D%2220%22%20fill%3D%22%239ca3af%22%20text-anchor%3D%22middle%22%20dominant-baseline%3D%22middle%22%3ENo%20Image%3C%2Ftext%3E%3C%2Fsvg%3E',
    'Hollow Protocol gameplay screenshot',
    'Exploring the deep server networks in Hollow Protocol',
    3210,
    false,
    now() - interval '12 days'
  )
on conflict (id) do nothing;

-- ============================================================
-- SAMPLE COMMENTS
-- ============================================================
insert into public.comments (id, post_id, author_id, content, created_at) values
  ('00000000-0000-4000-8000-000000000201',
   '00000000-0000-4000-8000-000000000001',
   '00000000-0000-4000-8000-000000000105',
   'Local-first is the future. I moved all my notes to an offline-first app last year and never looked back.',
   now() - interval '20 hours'),
  ('00000000-0000-4000-8000-000000000202',
   '00000000-0000-4000-8000-000000000001',
   '00000000-0000-4000-8000-00000000010A',
   'CRDTs are genuinely underrated tech. The way they resolve conflicts without a central server is elegant.',
   now() - interval '15 hours'),
  ('00000000-0000-4000-8000-000000000203',
   '00000000-0000-4000-8000-000000000001',
   '00000000-0000-4000-8000-000000000104',
   'Great write-up. Would love a follow-up comparing specific local-first databases.',
   now() - interval '10 hours'),
  ('00000000-0000-4000-8000-000000000204',
   '00000000-0000-4000-8000-000000000002',
   '00000000-0000-4000-8000-00000000010C',
   'If neural rendering is half as good as promised, this changes everything for indie studios.',
   now() - interval '1 day'),
  ('00000000-0000-4000-8000-000000000205',
   '00000000-0000-4000-8000-000000000003',
   '00000000-0000-4000-8000-000000000109',
   'Below-threshold correction at 72 qubits is a huge deal. This is the moment quantum computing went from physics experiment to engineering.',
   now() - interval '2 days'),
  ('00000000-0000-4000-8000-000000000206',
   '00000000-0000-4000-8000-000000000005',
   '00000000-0000-4000-8000-000000000101',
   'Ran the new Mistral locally on my laptop yesterday. Honestly hard to tell it apart from the API versions for my use case.',
   now() - interval '3 days'),
  ('00000000-0000-4000-8000-000000000207',
   '00000000-0000-4000-8000-000000000007',
   '00000000-0000-4000-8000-000000000106',
   'This proves gear was never the bottleneck - vision was.',
   now() - interval '5 days'),
  ('00000000-0000-4000-8000-000000000208',
   '00000000-0000-4000-8000-000000000009',
   '00000000-0000-4000-8000-000000000103',
   'As someone who has treated sickle cell patients, seeing a functional cure in Phase III is emotional. Congratulations to the whole team.',
   now() - interval '7 days'),
  ('00000000-0000-4000-8000-000000000209',
   '00000000-0000-4000-8000-00000000000B',
   '00000000-0000-4000-8000-000000000102',
   '80% uplift with the same power envelope thanks to 2nm is wild. My wallet is not ready.',
   now() - interval '9 days'),
  ('00000000-0000-4000-8000-00000000020A',
   '00000000-0000-4000-8000-00000000000C',
   '00000000-0000-4000-8000-00000000010B',
   'The memory echo mechanic alone makes this worth playing. Instant classic.',
   now() - interval '11 days')
on conflict (id) do nothing;

-- Sync comment counters to the sample comments inserted above.
update public.posts p
set comments = (select count(*) from public.comments c where c.post_id = p.id);

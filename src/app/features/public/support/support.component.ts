import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface FAQ {
  id: number;
  category: string;
  question: string;
  answer: string;
}

const CATEGORIES = [
  { id: 'all', label: 'All Topics', icon: 'help' },
  { id: 'general', label: 'General Info', icon: 'info' },
  { id: 'courses', label: 'Course Access', icon: 'school' },
  { id: 'kits', label: 'Craft Kits & Delivery', icon: 'package_2' },
  { id: 'billing', label: 'Billing & Refunds', icon: 'payments' },
];

const FAQS: FAQ[] = [
  {
    id: 1,
    category: 'courses',
    question: 'How long do I have access to my courses?',
    answer: 'You have lifetime access to any course you purchase! You can learn at your own pace, rewatch lessons as many times as you like, and access all future updates to the course material.'
  },
  {
    id: 2,
    category: 'kits',
    question: 'Are craft materials and kits included in the course price?',
    answer: 'It depends on the course option you choose. We offer both "Course Only" and "Course + Premium Kit" packages. If you choose the Kit package, a curated box of premium materials will be shipped to your address.'
  },
  {
    id: 3,
    category: 'billing',
    question: 'What is your refund policy?',
    answer: 'We want you to love your crafting experience! If you are unsatisfied, you can request a full refund within 14 days of purchase, provided you have not completed more than 20% of the course content. Note that kits are non-refundable once shipped.'
  },
  {
    id: 4,
    category: 'general',
    question: 'Can I interact with the trainers or ask questions?',
    answer: 'Yes, absolutely! Each course includes a dedicated discussion board where you can post photos of your progress, ask questions, and receive personalized feedback directly from the trainer.'
  },
  {
    id: 5,
    category: 'courses',
    question: 'Can I download the course videos for offline viewing?',
    answer: 'To protect our trainers\' intellectual property, videos cannot be downloaded. However, our web platform is optimized for mobile and desktop browsers so you can stream your lessons smoothly anywhere.'
  },
  {
    id: 6,
    category: 'kits',
    question: 'How long does shipping take for the craft kits?',
    answer: 'Kits are packed and shipped within 2 business days of order confirmation. Domestic shipping typically takes 3 to 7 business days. You will receive a tracking link via email once your kit is shipped.'
  },
  {
    id: 7,
    category: 'billing',
    question: 'Do you offer certificates upon completion?',
    answer: 'Yes! Upon successfully completing all modules of a course and submitting your final project photo, a personalized digital Lemon Academia Certificate of Completion will be generated for you.'
  }
];

@Component({
  selector: 'app-support',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './support.component.html'
})
export class SupportComponent {
  categories = CATEGORIES;
  faqs = FAQS;

  searchQuery = signal<string>('');
  selectedCategory = signal<string>('all');
  openFaqId = signal<number | null>(null);

  formSubmitted = signal<boolean>(false);
  name = signal<string>('');
  email = signal<string>('');
  subject = signal<string>('');
  message = signal<string>('');

  toggleFaq(id: number): void {
    this.openFaqId.update(curr => curr === id ? null : id);
  }

  get filteredFaqs(): FAQ[] {
    const q = this.searchQuery().toLowerCase();
    const cat = this.selectedCategory();
    return this.faqs.filter(faq => {
      const matchesCat = cat === 'all' || faq.category === cat;
      const matchesQ = faq.question.toLowerCase().includes(q) || faq.answer.toLowerCase().includes(q);
      return matchesCat && matchesQ;
    });
  }

  handleFormSubmit(): void {
    this.formSubmitted.set(true);
    this.name.set('');
    this.email.set('');
    this.subject.set('');
    this.message.set('');
  }
}

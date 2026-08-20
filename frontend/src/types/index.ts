export interface User {
  id: string;
  email: string;
  full_name?: string;
  company_name?: string;
  company_logo?: string;
  created_at: string;
}

export interface Client {
  id: string;
  user_id: string;
  name: string;
  email: string;
  company?: string;
  phone?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface ProposalSection {
  id?: string;
  section_type: string;
  title: string;
  content: string;
  order_index: number;
}

export interface PricingItem {
  id?: string;
  title: string;
  description?: string;
  hours: number;
  rate: number;
  amount: number;
  milestone?: string;
  order_index: number;
}

export interface ProposalVersion {
  id: string;
  version_number: number;
  data: any;
  created_at: string;
}

export interface Proposal {
  id: string;
  user_id: string;
  client_id?: string;
  title: string;
  project_type?: string;
  status: 'draft' | 'sent' | 'accepted' | 'rejected' | 'changes_requested';
  total_price: number;
  currency: string;
  estimated_duration_days: number;
  hourly_rate: number;
  token: string;
  created_at: string;
  updated_at: string;
  sections: ProposalSection[];
  pricing_items: PricingItem[];
}

export interface PublicProposal {
  id: string;
  title: string;
  project_type?: string;
  status: string;
  total_price: number;
  currency: string;
  estimated_duration_days: number;
  hourly_rate: number;
  token: string;
  created_at: string;
  company_name?: string;
  company_logo?: string;
  client_name?: string;
  client_company?: string;
  sections: ProposalSection[];
  pricing_items: PricingItem[];
}

export interface FeatureItem {
  title: string;
  description: string;
  complexity: 'low' | 'medium' | 'high';
  estimated_hours: number;
}

export interface MissingInfoItem {
  category: string;
  question: string;
  reason: string;
}

export interface RequirementAnalysisResponse {
  project_type: string;
  summary: string;
  extracted_features: FeatureItem[];
  missing_information: MissingInfoItem[];
  clarifying_questions: string[];
  suggested_hourly_rate: number;
}

export interface ProposalGenerationResponse {
  title: string;
  project_type: string;
  executive_summary: string;
  total_price: number;
  estimated_duration_days: number;
  hourly_rate: number;
  sections: ProposalSection[];
  pricing_items: PricingItem[];
}

export interface DashboardStats {
  total_proposals: number;
  draft_proposals: number;
  sent_proposals: number;
  accepted_proposals: number;
  changes_requested_proposals: number;
  total_clients: number;
  recent_proposals: Proposal[];
}

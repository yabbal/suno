export interface ClientOptions {
	/** Cookie or JWT token for authentication */
	cookie: string;
	/** Base URL for the API (optional) */
	baseURL?: string;
	/** Number of retries on failure (default: 2) */
	retry?: number;
	/** Delay between retries in ms (default: 500) */
	retryDelay?: number;
}

// --- Clips / Songs ---

export type ClipStatus =
	| "submitted"
	| "queued"
	| "streaming"
	| "complete"
	| "error";

export type ModelVersion = "chirp-v3-0" | "chirp-v3-5" | "chirp-v4" | string;

export interface ClipMetadata {
	prompt: string | null;
	gpt_description_prompt: string | null;
	tags: string | null;
	negative_tags: string | null;
	duration: number;
	type: string;
	error_message: string | null;
	stem_from_id?: string;
}

export interface Clip {
	id: string;
	title: string;
	audio_url: string;
	video_url: string;
	image_url: string;
	image_large_url: string;
	status: ClipStatus;
	created_at: string;
	model_name: string;
	display_name: string;
	handle: string;
	is_public: boolean;
	is_liked: boolean;
	play_count: number;
	upvote_count: number;
	metadata: ClipMetadata;
}

export interface GenerateDescriptionParams {
	gpt_description_prompt: string;
	make_instrumental?: boolean;
	mv?: ModelVersion;
}

export interface GenerateCustomParams {
	prompt: string;
	tags: string;
	title: string;
	negative_tags?: string;
	make_instrumental?: boolean;
	mv?: ModelVersion;
}

export interface GenerateExtendParams {
	prompt?: string;
	tags?: string;
	title?: string;
	continue_clip_id: string;
	continue_at: number;
	mv?: ModelVersion;
}

export interface GenerateResponse {
	clips: Clip[];
}

export interface ConcatParams {
	clip_id: string;
}

export interface FeedParams {
	ids?: string;
	page?: number;
}

export interface FeedResponse {
	clips: Clip[];
}

export interface SetVisibilityParams {
	is_public: boolean;
}

// --- Lyrics ---

export type LyricsStatus = "running" | "complete" | "error";

export interface LyricsGeneration {
	id: string;
	status: LyricsStatus;
	title: string;
	text: string;
}

export interface GenerateLyricsParams {
	prompt: string;
}

export interface AlignedWord {
	word: string;
	start_s: number;
	end_s: number;
	success: boolean;
	p_align: number;
}

export interface AlignedLyricsResponse {
	aligned_words: AlignedWord[];
}

// --- Stems ---

export interface StemsResponse {
	clips: Clip[];
}

// --- Billing ---

export interface BillingInfo {
	total_credits_left: number;
	period: string;
	monthly_limit: number;
	monthly_usage: number;
}

// --- Personas ---

export interface Persona {
	id: string;
	name: string;
	description: string;
	image_s3_id: string;
	is_public: boolean;
	is_public_approved: boolean;
	is_owned: boolean;
	is_loved: boolean;
	upvote_count: number;
	clip_count: number;
	user_display_name: string;
	user_handle: string;
	user_image_url: string;
}

export interface PersonaResponse {
	persona: Persona;
	total_results: number;
	current_page: number;
	is_following: boolean;
}

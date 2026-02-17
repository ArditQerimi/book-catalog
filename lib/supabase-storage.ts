import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

export const supabase = createClient(supabaseUrl, supabaseServiceKey);

export async function uploadToSupabase(file: File): Promise<{ success: boolean; url?: string; error?: string }> {
    try {
        const bucket = 'book-images';
        const fileExt = file.name.split('.').pop();
        const fileName = `${Math.random().toString(36).substring(2)}_${Date.now()}.${fileExt}`;
        const filePath = `covers/${fileName}`;

        const { data, error } = await supabase.storage
            .from(bucket)
            .upload(filePath, file, {
                cacheControl: '3600',
                upsert: false
            });

        if (error) {
            console.error('Supabase Storage Error:', error);
            return { success: false, error: error.message };
        }

        const { data: { publicUrl } } = supabase.storage
            .from(bucket)
            .getPublicUrl(filePath);

        return { success: true, url: publicUrl };
    } catch (err: any) {
        console.error('Upload catch error:', err);
        return { success: false, error: err.message };
    }
}

export async function deleteFromSupabase(url: string): Promise<{ success: boolean; error?: string }> {
    try {
        const bucket = 'book-images';
        const pathParts = url.split(`${bucket}/`);
        if (pathParts.length < 2) return { success: false, error: "Invalid Supabase URL" };

        const filePath = pathParts[1];

        const { error } = await supabase.storage
            .from(bucket)
            .remove([filePath]);

        if (error) {
            console.error('Supabase Delete Error:', error);
            return { success: false, error: error.message };
        }

        return { success: true };
    } catch (err: any) {
        console.error('Delete catch error:', err);
        return { success: false, error: err.message };
    }
}

import {computed, ref} from "vue";
import { defineStore } from "pinia";
import { useFetchAPI } from "@/composables/useFetchAPI";
import type { EdamamRecipes, EdamamResult } from "@/types/Edamam";
import type { BookmarkMeal, BookmarkURI } from "@/types/Bookmark";

export const useBookmarkStore = defineStore('bookmark', () => {
  const bookmarks = ref<EdamamRecipes[]>([]);
  const bookmarkURIs = ref<BookmarkURI[]>([]);

  const _bookmarks = computed((): BookmarkMeal => {
    return {
      URIs: bookmarkURIs.value,
      meals: bookmarks.value
    }
  })

  const getBookmarks = async () => {
    const response = await useFetchAPI({
      url: '/meal/bookmarks',
      method: 'GET'
    });

    populate(response.data);

    return response;
  }

  const create = async (uri: string) => {
    const response = await useFetchAPI({
      url: '/meal/bookmarks',
      method: 'POST',
      data: JSON.stringify({
        uri: uri
      })
    });

    populate(response.data);

    return response;
  }

  const remove = async (uri: string) => {
    const bookmark = bookmarkURIs.value.find(bookmark => bookmark.uri === uri);

    if (!bookmark) {
      throw new Error(`Bookmark with uri ${uri} not found`);
    }

    const id = bookmark.id;

    const response = await useFetchAPI({
      url: `/meal/bookmarks/${id}`,
      method: 'DELETE',
    });

    populate(response.data);

    return response;
  }

  const populate = (data: { bookmarks: any, payload: EdamamResult }) => {
    // Populate URIs
    bookmarkURIs.value = data.bookmarks;

    // Populate bookmarks
    const payload = data.payload as EdamamResult
    bookmarks.value = payload.hits;
  }

  return { _bookmarks, getBookmarks, create, remove }
});
<script setup lang="ts">
/*
Example of how to use Nuxt's server API to get data from Supabase
    This is how we do it in actual production for sercurity
    For this assessment, you can use the client side API

const body = {
  table: "table_name",
  bucket: "bucket_name",
  fileName: "file_name",
}

const data = await $fetch("/api/fetchData", {
  method: "POST",
  body,
});

console.log(data); // either table data in JSON format or URL to image/whatever asset
*/

// Using the client side API to get data from Supabase
const client = useSupabaseClient();

// Example of how to get table data from Supabase
async function getTableData(table: string) {
  const { data, error } = await client.from(table).select("*");
  if (error) {
    console.error(error);
  }

  // Data is returned in JSON format
  console.log(data);
  return data;
}

// Example of how to serve a file from Supabase storage
async function getStorageUrl(bucket: string, fileName: string) {
  const { data, error } = await client.storage
    .from(bucket)
    .createSignedUrl(fileName, 300);
  if (error) {
    console.error(error);
  }

  // Data is returned is a JSON containing the URL
  console.log(data);
  return data;
}

// Create dynamic reference to table data
//    Anything inside a 'ref' vue/nuxt will watch for changes and update the DOM
const dataReference = ref<any>(null);
const retrievedData = await getTableData("table_name");

if (retrievedData && retrievedData.length > 0) {
  dataReference.value = retrievedData;
} else {
  dataReference.value = [
    { id: 1, message: "Sample Data 1" },
    { id: 2, message: "Sample Data 2" },
    { id: 3, message: "Sample Data 3" },
    { id: 4, message: "Sample Data 4" },
    { id: 5, message: "Sample Data 5" },
  ];
}

// Using a reactive form state to handle user input
const formState = reactive({
  message: "",
});

// Fill in with code to upload data to Supabase
//    Database: https://supabase.com/docs/reference/javascript/upsert
//    Storage: https://supabase.com/docs/guides/storage/uploads/standard-uploads
async function submitForm() {
  console.log("Form State: ", formState);
  // YOUR CODE HERE
}
</script>

<template>
  <!-- A basic form is provided as an example. Modify it as you please. -->
  <div class="flex flex-col items-center justify-center h-screen">
    <img src="/full_logo.png" alt="Clear Lakes Dental" class="w-75 h-75 mb-4" />
    <h1 class="text-3xl font-bold">Supabase Demo</h1>

    <div class="flex flex-col justify-center items-center gap-4 w-full mt-8">
      <h2 class="text-2xl font-bold">Table Data</h2>
      <ul>
        <!-- Example of how to cleanly display data via vue loops -->
        <li v-for="item in dataReference" :key="item.id">
          <span>{{ item }}</span>
        </li>
      </ul>
    </div>

    <div class="flex flex-col justify-center items-center gap-4 w-full mt-8">
      <h2 class="text-2xl font-bold">Form</h2>
      <p>Form State {{ formState }}</p>
      <div class="flex flex-row gap-4">
        <p>Message:</p>
        <!-- v-model allows the input to simultaneously dipslay and update the formState.message variable -->
        <input
          type="text"
          v-model="formState.message"
          placeholder="Enter a message"
        />
      </div>
      <button
        class="bg-blue-500 text-white px-4 py-2 rounded-md"
        @click="submitForm"
      >
        Submit
      </button>
    </div>
  </div>
</template>
